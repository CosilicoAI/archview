import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Rule, RuleStats } from '../lib/supabase'

const PAGE_SIZE = 50

export interface UseRulesOptions {
  jurisdiction?: string
  search?: string
  parentId?: string | null
}

export interface UseRulesResult {
  rules: Rule[]
  stats: RuleStats[]
  loading: boolean
  error: string | null
  totalCount: number
  page: number
  hasMore: boolean
  loadMore: () => void
  refresh: () => void
}

export function useRules(options: UseRulesOptions = {}): UseRulesResult {
  const { jurisdiction, search, parentId } = options

  const [rules, setRules] = useState<Rule[]>([])
  const [stats, setStats] = useState<RuleStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(0)

  const fetchStats = useCallback(async () => {
    try {
      // Get counts by jurisdiction
      const jurisdictions = ['us', 'uk', 'canada']
      const statsPromises = jurisdictions.map(async (jur) => {
        const { count } = await supabase
          .from('rules')
          .select('*', { count: 'exact', head: true })
          .eq('jurisdiction', jur)
        return { jurisdiction: jur, count: count || 0 }
      })
      const results = await Promise.all(statsPromises)
      setStats(results)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }, [])

  const fetchRules = useCallback(async (pageNum: number, append = false) => {
    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('rules')
        .select('*', { count: 'exact' })
        .is('parent_id', null) // Only top-level rules by default
        .order('jurisdiction')
        .order('source_path')
        .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1)

      if (jurisdiction) {
        query = query.eq('jurisdiction', jurisdiction)
      }

      if (parentId !== undefined) {
        if (parentId === null) {
          query = query.is('parent_id', null)
        } else {
          query = query.eq('parent_id', parentId)
        }
      }

      if (search) {
        // Use full-text search
        query = query.textSearch('search_vector', search, { type: 'websearch' })
      }

      const { data, error: fetchError, count } = await query

      if (fetchError) {
        throw fetchError
      }

      setRules(append ? [...rules, ...(data || [])] : (data || []))
      setTotalCount(count || 0)
      setPage(pageNum)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch rules'
      setError(message)
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [jurisdiction, search, parentId, rules])

  const loadMore = useCallback(() => {
    if (!loading && rules.length < totalCount) {
      fetchRules(page + 1, true)
    }
  }, [loading, rules.length, totalCount, page, fetchRules])

  const refresh = useCallback(() => {
    setRules([])
    setPage(0)
    fetchRules(0)
  }, [fetchRules])

  // Initial load
  useEffect(() => {
    fetchStats()
    fetchRules(0)
  }, [jurisdiction, search, parentId]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    rules,
    stats,
    loading,
    error,
    totalCount,
    page,
    hasMore: rules.length < totalCount,
    loadMore,
    refresh,
  }
}

export function useRule(id: string | null) {
  const [rule, setRule] = useState<Rule | null>(null)
  const [children, setChildren] = useState<Rule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setRule(null)
      setChildren([])
      setLoading(false)
      return
    }

    const fetchRule = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch the rule
        const { data: ruleData, error: ruleError } = await supabase
          .from('rules')
          .select('*')
          .eq('id', id)
          .single()

        if (ruleError) throw ruleError

        setRule(ruleData)

        // Fetch children
        const { data: childrenData, error: childrenError } = await supabase
          .from('rules')
          .select('*')
          .eq('parent_id', id)
          .order('ordinal')

        if (childrenError) throw childrenError

        setChildren(childrenData || [])
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch rule'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchRule()
  }, [id])

  return { rule, children, loading, error }
}
