-- Włączenie RLS dla tabeli cache
ALTER TABLE categorized_articles ENABLE ROW LEVEL SECURITY;

-- Polityka odczytu danych - tylko wiersze z ostatnich 30 dni
CREATE POLICY "Tylko odczyt danych cache z ostatnich 30 dni" ON categorized_articles FOR
SELECT
    USING (created_at > now () - interval '30 days');

-- Polityka dodawania danych - tylko konto serwisowe może dodawać dane
CREATE POLICY "Tylko serwis może dodawać dane do cache" ON categorized_articles FOR INSERT
WITH
    CHECK (auth.role () = 'service_role');

-- Polityka aktualizacji danych - tylko konto serwisowe może aktualizować dane
CREATE POLICY "Tylko serwis może aktualizować dane w cache" ON categorized_articles FOR
UPDATE USING (auth.role () = 'service_role')
WITH
    CHECK (auth.role () = 'service_role');

-- Polityka usuwania danych - tylko konto serwisowe może usuwać dane
CREATE POLICY "Tylko serwis może usuwać dane z cache" ON categorized_articles FOR DELETE USING (auth.role () = 'service_role');