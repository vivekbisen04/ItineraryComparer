import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '@/lib/utils';

const STORAGE_KEY = 'itinerary-comparer-data';

export const useItineraryStore = create(
  persist(
    (set, get) => ({
      itineraries: [],
      comparisonMode: false,
      selectedIds: [],

      addItinerary: (data) => {
        const id = generateId();
        const newItinerary = { ...data, id, uploadedAt: new Date().toISOString() };

        set((state) => ({
          itineraries: [...state.itineraries, newItinerary],
        }));

        return id;
      },

      removeItinerary: (id) => {
        set((state) => ({
          itineraries: state.itineraries.filter((item) => item.id !== id),
          selectedIds: state.selectedIds.filter((selectedId) => selectedId !== id),
        }));
      },

      updateItinerary: (id, updates) => {
        set((state) => ({
          itineraries: state.itineraries.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      setComparisonMode: (mode) => {
        set({ comparisonMode: mode });
      },

      toggleSelection: (id) => {
        set((state) => {
          const isSelected = state.selectedIds.includes(id);
          return {
            selectedIds: isSelected
              ? state.selectedIds.filter((selectedId) => selectedId !== id)
              : [...state.selectedIds, id],
          };
        });
      },

      clearAll: () => {
        set({ itineraries: [], comparisonMode: false, selectedIds: [] });
      },

      getItineraryById: (id) => {
        return get().itineraries.find((item) => item.id === id);
      },
    }),
    {
      name: STORAGE_KEY,
      version: 1,
    }
  )
);
