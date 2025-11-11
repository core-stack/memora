import { useState, useCallback } from 'react';

export function useDownload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const download = useCallback(async (url: string, filename?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erro ao baixar arquivo (${response.status})`);
      }

      const blob = await response.blob();

      const link = document.createElement('a');
      const objectUrl = window.URL.createObjectURL(blob);

      link.href = objectUrl;
      link.download = filename || extractFileNameFromUrl(url);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch (err) {
      setError((err as Error).message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  return { download, loading, error };
}

function extractFileNameFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const parts = pathname.split('/');
    return parts[parts.length - 1] || 'arquivo';
  } catch {
    return 'arquivo';
  }
}
