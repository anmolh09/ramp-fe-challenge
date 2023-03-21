import { useCallback, useState } from "react";
import {
  PaginatedRequestParams,
  PaginatedResponse,
  Transaction
} from "../utils/types";
import { PaginatedTransactionsResult } from "./types";
import { useCustomFetch } from "./useCustomFetch";

export function usePaginatedTransactions(): PaginatedTransactionsResult {
  const { fetchWithCache, loading } = useCustomFetch();
  const [
    paginatedTransactions,
    setPaginatedTransactions
  ] = useState<PaginatedResponse<Transaction[]> | null>(null);

  const [isEnd, setIsEnd] = useState(false);

  const fetchAll = useCallback(async () => {
    console.log("paginatedTransactions", paginatedTransactions?.nextPage);
    const response = await fetchWithCache<
      PaginatedResponse<Transaction[]>,
      PaginatedRequestParams
    >("paginatedTransactions", {
      page: paginatedTransactions === null ? 0 : paginatedTransactions.nextPage
    });

    setPaginatedTransactions((previousResponse) => {
      console.log("res", response, "prev", previousResponse);
      if (response?.nextPage === null) {
        setIsEnd(true);
        // return re
      } else {
        setIsEnd(false);
      }
      return { data: response.data, nextPage: response.nextPage };
    });
  }, [fetchWithCache, paginatedTransactions, isEnd]);

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null);
    setIsEnd(false);
  }, []);

  return {
    data: paginatedTransactions,
    loading,
    fetchAll,
    invalidateData,
    isEnd
  };
}
