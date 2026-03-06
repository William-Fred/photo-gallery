CREATE TABLE IF NOT EXISTS images (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name   TEXT        NOT NULL,
    storage_key TEXT        NOT NULL,
    content_type TEXT       NOT NULL,
    file_size   BIGINT      NOT NULL,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
