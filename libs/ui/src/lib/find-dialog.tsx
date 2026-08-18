import { Box, Button, Group, Loader, Modal, Stack, Text, TextInput } from '@mantine/core';
import type { ReactElement, KeyboardEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './find-dialog.module.scss';

export interface FindDialogItem {
  name: string;
  stereotype: string;
  retired?: boolean;
  description?: string;
  catalogueItemId: string;
}

export interface FindSearchRequest {
  prefix?: string;
  offset: number;
  max: number;
}

export interface FindSearchPage {
  count: number;
  items: FindDialogItem[];
}

export interface FindDialogProps {
  opened: boolean;
  onClose: () => void;
  onSearch: (request: FindSearchRequest) => Promise<FindSearchPage>;
  onSelect?: (item: FindDialogItem) => void;
  title?: string;
  placeholder?: string;
  pageSize?: number;
}

const DEBOUNCE_MS = 300;

export function FindDialog({
  opened,
  onClose,
  onSearch,
  onSelect,
  title = 'Find',
  placeholder = 'Search',
  pageSize = 100
}: FindDialogProps): ReactElement {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<FindDialogItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const hasTypedRef = useRef(false);
  const requestVersionRef = useRef(0);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const itemButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const hasMore = items.length < totalCount;

  // Reset active index whenever the item list changes
  useEffect(() => {
    setActiveIndex(-1);
    itemButtonRefs.current = [];
  }, [items]);

  // Re-focus input whenever the dialog opens
  useEffect(() => {
    if (opened) {
      window.setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [opened]);

  const scrollItemIntoView = useCallback((index: number) => {
    const btn = itemButtonRefs.current[index];
    if (btn) {
      btn.scrollIntoView({ block: 'nearest' });
    }
  }, []);

  const fetchPage = useCallback(
    async (searchPrefix: string, offset: number, replace: boolean) => {
      const requestVersion = ++requestVersionRef.current;
      const isFirstPage = offset === 0;

      setError('');
      if (isFirstPage) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const page = await onSearch({
          prefix: searchPrefix.trim().length > 0 ? searchPrefix.trim() : undefined,
          offset,
          max: pageSize
        });

        if (requestVersion !== requestVersionRef.current) {
          return;
        }

        setTotalCount(page.count ?? 0);
        setItems((current) => (replace ? page.items ?? [] : [...current, ...(page.items ?? [])]));
      } catch {
        if (requestVersion !== requestVersionRef.current) {
          return;
        }

        setItems([]);
        setTotalCount(0);
        setError('Could not load search results.');
      } finally {
        if (requestVersion === requestVersionRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [onSearch, pageSize]
  );

  const resetAndLoad = useCallback(
    async (searchPrefix: string) => {
      requestVersionRef.current += 1;
      setItems([]);
      setTotalCount(0);
      await fetchPage(searchPrefix, 0, true);
    },
    [fetchPage]
  );

  useEffect(() => {
    if (!opened) {
      hasTypedRef.current = false;
      requestVersionRef.current += 1;
      setQuery('');
      setItems([]);
      setTotalCount(0);
      setLoading(false);
      setLoadingMore(false);
      setError('');
      setActiveIndex(-1);
      return;
    }

    hasTypedRef.current = false;
    setQuery('');
    void resetAndLoad('');
  }, [opened, resetAndLoad]);

  useEffect(() => {
    if (!opened || !hasTypedRef.current) {
      return;
    }

    const timer = window.setTimeout(() => {
      void resetAndLoad(query);
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [opened, query, resetAndLoad]);

  const handleResultsScroll = useCallback(() => {
    const viewport = resultsRef.current;

    if (!viewport || loading || loadingMore || !hasMore) {
      return;
    }

    const threshold = 96;
    const scrolledToBottom = viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - threshold;

    if (scrolledToBottom) {
      void fetchPage(query, items.length, false);
    }
  }, [fetchPage, hasMore, items.length, loading, loadingMore, query]);

  const onQueryChange = (value: string) => {
    hasTypedRef.current = true;
    setActiveIndex(-1);
    setQuery(value);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (items.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = Math.min(activeIndex + 1, items.length - 1);
      setActiveIndex(next);
      scrollItemIntoView(next);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prev = Math.max(activeIndex - 1, -1);
      setActiveIndex(prev);
      if (prev === -1) {
        inputRef.current?.focus();
      } else {
        scrollItemIntoView(prev);
      }
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      const selected = items[activeIndex];
      if (selected) {
        onSelect?.(selected);
      }
    }
  };

  const resultsContent = useMemo(() => {
    if (loading && items.length === 0) {
      return <Text c='dimmed'>Searching...</Text>;
    }

    if (error) {
      return <Text c='red'>{error}</Text>;
    }

    if (query.trim().length === 0 && items.length === 0 && !loading) {
      return <Text c='dimmed'>Start typing to search.</Text>;
    }

    if (query.trim().length > 0 && items.length === 0 && !loading) {
      return <Text c='dimmed'>No results found.</Text>;
    }

    return (
      <Stack gap='xs'>
        {items.map((item, index) => (
          <Button
            key={item.catalogueItemId}
            ref={(el) => { itemButtonRefs.current[index] = el; }}
            variant='subtle'
            color='dark'
            justify='flex-start'
            fullWidth
            className={`${styles.findDialogResultItem}${index === activeIndex ? ` ${styles.findDialogResultItemActive}` : ''}`}
            aria-selected={index === activeIndex}
            onClick={() => onSelect?.(item)}
          >
            <Text
              component='p'
              className={`${styles.findDialogResultName} ${item.stereotype}${item.retired ? ' retired' : ''}`}
              data-stereotype={item.stereotype}
              data-retired={item.retired ? 'true' : 'false'}
              fw={600}
              lineClamp={1}
            >
              {item.name}
            </Text>
          </Button>
        ))}

        {loadingMore && (
          <Group justify='center' py='xs'>
            <Loader size='xs' />
            <Text size='sm' c='dimmed'>Loading more…</Text>
          </Group>
        )}
      </Stack>
    );
  }, [activeIndex, error, items, loading, loadingMore, onSelect, query]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size='70rem'
      centered
      styles={{
        content: { display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        body: { overflow: 'hidden', padding: '1rem' }
      }}
    >
      <Stack gap='sm'>
        <TextInput
          ref={inputRef}
          label='Search'
          placeholder={placeholder}
          value={query}
          autoComplete='off'
          spellCheck={false}
          autoCorrect='off'
          autoCapitalize='none'
          onChange={(event) => onQueryChange(event.currentTarget.value)}
          onKeyDown={handleInputKeyDown}
        />

        <Box ref={resultsRef} className={styles.findDialogResults} onScroll={handleResultsScroll}>
          {resultsContent}
        </Box>
      </Stack>
    </Modal>
  );
}

