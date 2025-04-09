import { useEffect, useRef, useState, RefObject, useCallback } from 'react';

/** Typ wyliczeniowy kategorii */
export type Category = 'priorytet' | 'ważne' | 'normalne' | 'do pominięcia' | 'do usunięcia';

/** Interfejs przechowujący statystyki interakcji dla pojedynczego elementu */
interface InteractionRecord<T> {
  item: T;             // referencja do oryginalnego obiektu elementu (opcjonalnie)
  clicks: number;      // liczba kliknięć
  replies: number;     // liczba akcji "odpisz"
  deleted: boolean;    // czy element został oznaczony jako usunięty
  hasBeenSeen: boolean;// czy element był kiedykolwiek widoczny (przewinięty do widoku)
  category: Category;  // bieżąca kategoria klasyfikacji
  _inView?: boolean;   // oznaczenie wewnętrzne (tymczasowe) że jest aktualnie w widoku
}

/** Opcje konfiguracji dla useListClassifier */
export interface ListClassifierOptions<T> {
  getId?: (item: T) => string | number;
  customClassifier?: (record: InteractionRecord<T>) => Category | void;
}

/** Typ wyniku zwracanego przez useListClassifier */
export interface ListClassifierResult<T> {
  categories: Record<string | number, Category>;
  itemRefs: Record<string | number, RefObject<HTMLElement>>;
  onClick: (id: string | number) => void;
  onReply: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}

/** Główny hook implementujący logikę klasyfikacji listy */
export function useListClassifier<T>(
  items: T[],
  options: ListClassifierOptions<T> = {}
): ListClassifierResult<T> {

  // Stan przechowujący mapę kategorii dla renderowania
  const [categories, setCategories] = useState<Record<string | number, Category>>({});

  // Referencja na mapę InteractionRecord dla elementów (użycie useRef, by mutacje nie wymuszały re-renderów)
  const interactionsRef = useRef(new Map<string | number, InteractionRecord<T>>());

  // Mapa referencji do elementów DOM (dla IntersectionObserver)
  const itemRefs = useRef<Record<string | number, RefObject<HTMLElement>>>({});

  // Referencja do obserwatora IntersectionObserver (do wykrywania scrollowania)
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Mapa do szybkiego tłumaczenia element -> ID (dla callbacku IntersectionObserver)
  const elementIdMap = useRef(new Map<HTMLElement, string | number>());
  
  // Bufor aktualizacji kategorii dla poprawy wydajności (batch updates)
  const pendingUpdatesRef = useRef<Record<string | number, Category>>({});
  const updateTimerRef = useRef<number | null>(null);

  // Funkcja pomocnicza: inicjalizuje rekord interakcji dla elementu o danym ID
  const initRecord = useCallback((id: string | number, item: T) => {
    const newRecord: InteractionRecord<T> = {
      item,
      clicks: 0,
      replies: 0,
      deleted: false,
      hasBeenSeen: false,
      category: 'normalne'
    };
    interactionsRef.current.set(id, newRecord);
    
    // Dodaj do oczekujących aktualizacji zamiast natychmiastowej zmiany stanu
    pendingUpdatesRef.current[id] = 'normalne';
    scheduleUpdate();
  }, []);
  
  // Zaplanuj aktualizację stanu - zbieranie zmian w jednej aktualizacji (batch update)
  const scheduleUpdate = useCallback(() => {
    if (updateTimerRef.current !== null) return;
    
    updateTimerRef.current = window.setTimeout(() => {
      if (Object.keys(pendingUpdatesRef.current).length === 0) {
        updateTimerRef.current = null;
        return;
      }
      
      setCategories(prev => ({
        ...prev,
        ...pendingUpdatesRef.current
      }));
      
      pendingUpdatesRef.current = {};
      updateTimerRef.current = null;
    }, 16); // ~60fps (1000ms / 60)
  }, []);

  // Obsługa zdarzeń IntersectionObserver
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    let hasUpdates = false;
    
    entries.forEach(entry => {
      const element = entry.target as HTMLElement;
      const id = elementIdMap.current.get(element);
      if (!id) return;
      
      const record = interactionsRef.current.get(id);
      if (!record) return;

      if (entry.isIntersecting) {
        // Element jest widoczny w viewport
        record.hasBeenSeen = true;
        record._inView = true;
      } else {
        // Element wyszedł z widoku (przewinięto go poza ekran)
        if (record._inView) {
          record._inView = false;
          // Jeśli użytkownik widział element, ale wciąż brak interakcji i nie został usunięty:
          if (!record.deleted && record.clicks === 0 && record.replies === 0) {
            // Klasyfikuj jako "do pominięcia"
            record.category = 'do pominięcia';
            pendingUpdatesRef.current[id] = 'do pominięcia';
            hasUpdates = true;
          }
        }
      }
    });
    
    if (hasUpdates) {
      scheduleUpdate();
    }
  }, [scheduleUpdate]);

  // Efekt: inicjalizacja IntersectionObserver raz (przy montowaniu)
  useEffect(() => {
    // Utworzenie obserwatora z domyślnymi opcjami (viewport jako root)
    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: null,       // obserwuj względem okna przeglądarki
      threshold: 0.0,   // wywołuj callback gdy choć minimalna część elementu pojawi/opuści viewport
      rootMargin: '0px' // bez dodatkowego marginesu
    });

    return () => {
      // Czyszczenie zasobów przy odmontowaniu
      if (updateTimerRef.current !== null) {
        clearTimeout(updateTimerRef.current);
        updateTimerRef.current = null;
      }
      
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [handleIntersection]);

  // Efekt: aktualizacja listy obserwowanych elementów, gdy zmienia się lista items
  useEffect(() => {
    // Zoptymalizowana wersja - najpierw zbieramy ID obecnych elementów
    const currentItemIds = new Set<string | number>();
    
    // Dodawanie nowych elementów:
    for (const item of items) {
      const id = options.getId ? options.getId(item) : (item as any).id;
      if (id == null) {
        continue; // Pomiń elementy bez ID
      }
      
      currentItemIds.add(id);
      
      // Utworzenie referencji i rekordu interakcji dla nowych elementów
      if (!itemRefs.current[id]) {
        itemRefs.current[id] = { current: null };
      }
      if (!interactionsRef.current.has(id)) {
        initRecord(id, item);
      }
    }

    // Usuwanie elementów, których nie ma już na liście
    const idsToRemove: (string | number)[] = [];
    interactionsRef.current.forEach((_, id) => {
      if (!currentItemIds.has(id)) {
        idsToRemove.push(id);
      }
    });
    
    if (idsToRemove.length > 0) {
      // Jedna aktualizacja stanu zamiast wielu oddzielnych
      setCategories(prev => {
        const newCatMap = { ...prev };
        
        for (const id of idsToRemove) {
          interactionsRef.current.delete(id);
          delete newCatMap[id];
          
          // Jeśli ref był przypięty do DOM, przestajemy go obserwować
          const elem = itemRefs.current[id]?.current;
          if (elem && observerRef.current) {
            observerRef.current.unobserve(elem);
            elementIdMap.current.delete(elem);
          }
          delete itemRefs.current[id];
        }
        
        return newCatMap;
      });
    }

    // Używamy requestAnimationFrame, aby uniknąć blokowania głównego wątku
    // przy dużej liczbie elementów
    if (observerRef.current) {
      requestAnimationFrame(() => {
        if (!observerRef.current) return;
        
        for (const item of items) {
          const id = options.getId ? options.getId(item) : (item as any).id;
          if (id == null) continue;
          
          const element = itemRefs.current[id]?.current;
          if (element && !elementIdMap.current.has(element)) {
            elementIdMap.current.set(element, id);
            observerRef.current.observe(element);
          }
        }
      });
    }
  }, [items, options, initRecord]);

  // Funkcja aktualizująca kategorię na podstawie aktualnego rekordu i ewentualnych reguł custom
  const recalcCategory = useCallback((id: string | number, record: InteractionRecord<T>) => {
    let newCategory: Category = record.category;
    
    // Uproszczona logika deterministyczna
    if (record.deleted) {
      newCategory = 'do usunięcia';
    } else if (record.replies > 0 || record.clicks >= 3) {
      newCategory = 'priorytet';
    } else if (record.clicks >= 1) {
      newCategory = 'ważne';
    } else if (record.hasBeenSeen && record.clicks === 0 && record.replies === 0) {
      newCategory = 'do pominięcia';
    } else {
      newCategory = 'normalne';
    }

    // Zastosuj ewentualną funkcję customClassifier
    if (options.customClassifier) {
      const overridden = options.customClassifier({ ...record });
      if (overridden) {
        newCategory = overridden;
      }
    }

    // Zaktualizuj stan, jeśli kategoria uległa zmianie
    if (newCategory !== record.category) {
      record.category = newCategory;
      pendingUpdatesRef.current[id] = newCategory;
      scheduleUpdate();
    }
  }, [options.customClassifier, scheduleUpdate]);

  // Funkcje obsługi interakcji (kliknięcie, odpowiedź, usunięcie):
  const onClick = useCallback((id: string | number) => {
    const record = interactionsRef.current.get(id);
    if (!record) return;
    record.clicks += 1;
    recalcCategory(id, record);
  }, [recalcCategory]);

  const onReply = useCallback((id: string | number) => {
    const record = interactionsRef.current.get(id);
    if (!record) return;
    record.replies += 1;
    recalcCategory(id, record);
  }, [recalcCategory]);

  const onDelete = useCallback((id: string | number) => {
    const record = interactionsRef.current.get(id);
    if (!record) return;
    record.deleted = true;
    recalcCategory(id, record);
  }, [recalcCategory]);

  // Zwracamy interfejs do wykorzystania w komponencie
  return {
    categories,
    itemRefs: itemRefs.current,
    onClick,
    onReply,
    onDelete
  };
}