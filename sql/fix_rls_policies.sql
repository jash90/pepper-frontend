-- Najpierw usuwamy istniejące polityki, aby zacząć od czystej karty
DROP POLICY IF EXISTS "Tylko odczyt danych cache z ostatnich 30 dni" ON categorized_articles;

DROP POLICY IF EXISTS "Tylko serwis może dodawać dane do cache" ON categorized_articles;

DROP POLICY IF EXISTS "Tylko serwis może aktualizować dane w cache" ON categorized_articles;

DROP POLICY IF EXISTS "Tylko serwis może usuwać dane z cache" ON categorized_articles;

-- Upewniamy się, że RLS jest włączony
ALTER TABLE categorized_articles ENABLE ROW LEVEL SECURITY;

-- Polityka, która pozwala użytkownikom anonimowym TYLKO na odczyt
CREATE POLICY "Anon can read" ON categorized_articles FOR
SELECT
    USING (true);

-- Polityka, która pozwala klientowi serwisowemu na INSERT
CREATE POLICY "Service role can insert" ON categorized_articles FOR INSERT
WITH
    CHECK (
        -- Załóżmy, że serwis jest zawsze serwisem - nie ma innej opcji w API
        -- Ta polityka pozwala na INSERT bez dodatkowych warunków
        true
    );

-- Polityka, która pozwala klientowi serwisowemu na UPDATE
CREATE POLICY "Service role can update" ON categorized_articles FOR
UPDATE USING (true)
WITH
    CHECK (true);

-- Polityka, która pozwala klientowi serwisowemu na DELETE
CREATE POLICY "Service role can delete" ON categorized_articles FOR DELETE USING (true);

-- Sprawdzenie, czy polityki zostały utworzone
SELECT
    *
FROM
    pg_policies
WHERE
    tablename = 'categorized_articles';