import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { COGNATE_SETS, LANGUAGE_FAMILIES, buildGraph } from '../mock/data'
export { LANGUAGE_FAMILIES, COGNATE_SETS }

export const useEtymologyStore = defineStore('etymology', () => {
  const graph = ref(buildGraph())
  const selectedNode = ref<any>(null)
  const searchQuery = ref('')
  const selectedFamily = ref('all')

  const filteredCognates = computed(() =>
    COGNATE_SETS.filter(cs => {
      const q = searchQuery.value.toLowerCase()
      const matchSearch = !q || cs.root.toLowerCase().includes(q) || cs.meaning.includes(q) || Object.values(cs.languages).some((w: string) => w.toLowerCase().includes(q))
      const matchFamily = selectedFamily.value === 'all' || cs.family === selectedFamily.value
      return matchSearch && matchFamily
    })
  )

  // 力导向网络跟随语系筛选；空结果时返回空节点/边，由视图层兜底
  const filteredGraph = computed(() => {
    const g = graph.value
    if (selectedFamily.value === 'all') return g
    const nodes = g.nodes.filter((n: any) => n.family === selectedFamily.value)
    const ids = new Set(nodes.map((n: any) => n.id))
    const links = g.links.filter((l: any) => ids.has(l.source) && ids.has(l.target))
    return { nodes, links }
  })

  return { graph, selectedNode, searchQuery, selectedFamily, filteredCognates, filteredGraph }
})
