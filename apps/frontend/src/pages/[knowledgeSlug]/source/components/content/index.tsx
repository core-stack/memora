import { Tab } from '../../context';
import { useSource } from '../../hooks/use-source';
import { PluginDocs } from './plugin-docs';
import { SourcePreview } from './source-preview';
import { UnselectedPlugin } from './unselected-plugin';
import { UnselectedTreeSource } from './unselected-tree-source';

export const SourcePageContent = () => {
  const { plugin, selectedFileId, tab } = useSource();
  if (plugin) return <PluginDocs />
  if (selectedFileId) return <SourcePreview />
  if (tab === Tab.ADD_SOURCE) return <UnselectedPlugin />
  return <UnselectedTreeSource />
}