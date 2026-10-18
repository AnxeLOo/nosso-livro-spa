import { apiClient } from './api';
import { Book, CategoryFilter, OpenLibrarySearchResponse, OpenLibraryWorkResponse, SortOption } from '../types/book';

const COVERS_BASE = import.meta.env.VITE_OPEN_LIBRARY_COVERS_BASE || 'https://covers.openlibrary.org';

export const CATEGORY_SUBJECT_MAP: Record<CategoryFilter, string> = {
  all: 'reading',
  fiction: 'fiction',
  science: 'science',
  history: 'history',
  classic: 'classic_literature',
  personal: 'self_help',
  technology: 'computer_science',
};

export const CATEGORY_LABELS: Record<CategoryFilter, string> = {
  all: 'Todos',
  fiction: 'Ficção',
  science: 'Ciência',
  history: 'História',
  classic: 'Clássicos',
  personal: 'Pessoal',
  technology: 'Tecnologia',
};

export function getCoverImageUrl(coverId?: number, size: 'S' | 'M' | 'L' = 'M'): string | undefined {
  if (!coverId || coverId <= 0) return undefined;
  return `${COVERS_BASE}/b/id/${coverId}-${size}.jpg`;
}

// Convert OpenLibrary doc to our Book model
export function transformSearchDocToBook(
  doc: {
    key: string;
    title: string;
    author_name?: string[];
    first_publish_year?: number;
    cover_i?: number;
    subject?: string[];
    number_of_pages_median?: number;
    publisher?: string[];
    isbn?: string[];
  },
  assignedCategory?: string
): Book {
  const cleanId = doc.key.replace('/works/', '').replace('/', '_');
  const coverUrl = getCoverImageUrl(doc.cover_i, 'M');

  // Pseudo-random deterministic values based on ID for realistic university library experience
  const hash = Math.abs(cleanId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
  const totalCopies = 2 + (hash % 4); // 2 to 5 copies
  const distanceKm = +(0.5 + ((hash % 30) / 10)).toFixed(1); // 0.5km to 3.5km

  // Owner mock initials for community feel from prototype
  const mockOwners = [
    { name: 'Luiza M.', initials: 'LM' },
    { name: 'Rafael C.', initials: 'RC' },
    { name: 'Beatriz N.', initials: 'BN' },
    { name: 'Gabriel S.', initials: 'GS' },
    { name: 'Mariana F.', initials: 'MF' },
    { name: 'Thiago P.', initials: 'TP' },
    { name: 'Biblioteca Central', initials: 'BC' },
  ];
  const owner = mockOwners[hash % mockOwners.length];

  return {
    id: cleanId,
    key: doc.key,
    title: doc.title,
    author: doc.author_name?.[0] || 'Autor desconhecido',
    firstPublishYear: doc.first_publish_year,
    coverId: doc.cover_i,
    coverUrl,
    category: assignedCategory || (doc.subject?.[0]?.toLowerCase() || 'geral'),
    subjects: doc.subject?.slice(0, 5),
    pageCount: doc.number_of_pages_median,
    publisher: doc.publisher?.[0],
    isbn: doc.isbn?.[0],
    totalCopies,
    availableCopies: totalCopies, // store will adjust based on active loans
    distanceKm,
    ownerName: owner.name,
    ownerInitials: owner.initials,
  };
}

export async function searchBooks(
  query: string,
  category: CategoryFilter = 'all',
  sort: SortOption = 'relevance',
  page: number = 1,
  limit: number = 20
): Promise<{ books: Book[]; total: number }> {
  try {
    const params: Record<string, string | number> = {
      limit,
      page,
    };

    let queryParam = query.trim();

    if (!queryParam) {
      if (category !== 'all') {
        const subject = CATEGORY_SUBJECT_MAP[category];
        queryParam = `subject:${subject}`;
      } else {
        queryParam = 'university library books';
      }
    } else {
      if (category !== 'all') {
        const subject = CATEGORY_SUBJECT_MAP[category];
        queryParam = `${queryParam} AND subject:${subject}`;
      }
    }

    params.q = queryParam;

    if (sort === 'newest') params.sort = 'new';
    else if (sort === 'oldest') params.sort = 'old';
    else if (sort === 'author') params.sort = 'author';

    const response = await apiClient.get<OpenLibrarySearchResponse>('/search.json', { params });
    const docs = response.data.docs || [];

    const books = docs.map((doc) => transformSearchDocToBook(doc, category !== 'all' ? category : undefined));
    return {
      books,
      total: response.data.numFound || books.length,
    };
  } catch (error) {
    console.error('Error fetching books from Open Library:', error);
    throw error;
  }
}

export async function getBookDetails(bookId: string): Promise<Book> {
  try {
    const workKey = bookId.includes('OL') ? (bookId.startsWith('OL') ? `/works/${bookId}` : bookId.replace('_', '/')) : `/works/${bookId}`;
    
    // First fetch work details
    const workRes = await apiClient.get<OpenLibraryWorkResponse>(`${workKey}.json`);
    const work = workRes.data;

    let description = '';
    if (typeof work.description === 'string') {
      description = work.description;
    } else if (work.description?.value) {
      description = work.description.value;
    }

    const coverId = work.covers?.[0];
    const coverUrl = getCoverImageUrl(coverId, 'L');

    // Also search by title to obtain author and publish year if needed
    let author = 'Autor desconhecido';
    let publishYear: number | undefined;

    try {
      const searchRes = await apiClient.get<OpenLibrarySearchResponse>('/search.json', {
        params: { q: `key:"${workKey}"`, limit: 1 },
      });
      if (searchRes.data.docs?.[0]) {
        const doc = searchRes.data.docs[0];
        author = doc.author_name?.[0] || author;
        publishYear = doc.first_publish_year;
      }
    } catch {
      // Fallback
    }

    const cleanId = workKey.replace('/works/', '').replace('/', '_');
    const hash = Math.abs(cleanId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
    const totalCopies = 2 + (hash % 4);

    return {
      id: cleanId,
      key: workKey,
      title: work.title,
      author,
      description: description || 'Nenhuma descrição detalhada disponível para este exemplar na Open Library.',
      firstPublishYear: publishYear,
      coverId,
      coverUrl,
      category: work.subjects?.[0] || 'geral',
      subjects: work.subjects?.slice(0, 8),
      totalCopies,
      availableCopies: totalCopies,
      ownerName: 'Biblioteca Universitária',
      ownerInitials: 'BU',
    };
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw error;
  }
}
