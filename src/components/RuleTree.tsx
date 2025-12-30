import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { supabase } from '../lib/supabase'
import type { Rule } from '../lib/supabase'
import * as styles from './RuleTree.css'

interface RuleTreeNodeProps {
  rule: Rule
  depth: number
  onSelect: (rule: Rule) => void
}

function RuleTreeNode({ rule, depth, onSelect }: RuleTreeNodeProps) {
  const [expanded, setExpanded] = useState(false)
  const [children, setChildren] = useState<Rule[]>([])
  const [loading, setLoading] = useState(false)
  const [hasChildren, setHasChildren] = useState<boolean | null>(null)

  const toggleExpand = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (expanded) {
      setExpanded(false)
      return
    }

    // Fetch children if not already loaded
    if (children.length === 0) {
      setLoading(true)
      try {
        const { data, count } = await supabase
          .from('rules')
          .select('*', { count: 'exact' })
          .eq('parent_id', rule.id)
          .order('ordinal')
          .limit(100)

        setChildren(data || [])
        setHasChildren((count || 0) > 0)
      } catch (err) {
        console.error('Failed to fetch children:', err)
      } finally {
        setLoading(false)
      }
    }

    setExpanded(true)
  }, [expanded, children.length, rule.id])

  // Check if this rule might have children (lazy check)
  const checkHasChildren = useCallback(async () => {
    if (hasChildren !== null) return

    try {
      const { count } = await supabase
        .from('rules')
        .select('*', { count: 'exact', head: true })
        .eq('parent_id', rule.id)
        .limit(1)

      setHasChildren((count || 0) > 0)
    } catch {
      setHasChildren(false)
    }
  }, [rule.id, hasChildren])

  // Lazy check on mount
  useState(() => {
    checkHasChildren()
  })

  const indent = depth * 20

  return (
    <div className={styles.nodeContainer}>
      <motion.div
        className={styles.nodeRow}
        style={{ paddingLeft: indent }}
        onClick={() => onSelect(rule)}
        whileHover={{ backgroundColor: 'rgba(0, 212, 255, 0.05)' }}
      >
        {/* Expand/collapse toggle */}
        <button
          className={styles.toggleButton}
          onClick={toggleExpand}
          disabled={hasChildren === false}
        >
          {loading ? (
            <span className={styles.spinner}>⟳</span>
          ) : hasChildren === false ? (
            <span className={styles.noChildren}>•</span>
          ) : expanded ? (
            <span>▼</span>
          ) : (
            <span>▶</span>
          )}
        </button>

        {/* Jurisdiction badge */}
        <span
          className={styles.badge}
          style={{ color: getJurisdictionColor(rule.jurisdiction) }}
        >
          {rule.jurisdiction.toUpperCase()}
        </span>

        {/* Citation path */}
        <span className={styles.citation}>
          {rule.source_path || rule.id.slice(0, 8)}
        </span>

        {/* Heading */}
        <span className={styles.heading}>
          {rule.heading || '(no heading)'}
        </span>
      </motion.div>

      {/* Children */}
      <AnimatePresence>
        {expanded && children.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={styles.childrenContainer}
          >
            {children.map((child) => (
              <RuleTreeNode
                key={child.id}
                rule={child}
                depth={depth + 1}
                onSelect={onSelect}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function getJurisdictionColor(jurisdiction: string): string {
  switch (jurisdiction) {
    case 'us': return '#ff4466'
    case 'uk': return '#00d4ff'
    case 'canada': return '#ff8800'
    default: return '#888'
  }
}

interface RuleTreeProps {
  rules: Rule[]
  onSelect: (rule: Rule) => void
}

export function RuleTree({ rules, onSelect }: RuleTreeProps) {
  return (
    <div className={styles.treeContainer}>
      {rules.map((rule) => (
        <RuleTreeNode
          key={rule.id}
          rule={rule}
          depth={0}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
