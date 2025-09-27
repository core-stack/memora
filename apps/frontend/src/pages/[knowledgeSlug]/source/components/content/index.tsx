import { Tab } from '../../context';
import { useSource } from '../../hooks/use-source';
import { FileContentViewer } from './file-preview';
import { PluginDocs } from './plugin-docs';
import { UnselectedFile } from './unselected-file';
import { UnselectedPlugin } from './unselected-plugin';

export const SourcePageContent = () => {
  const { plugin, selectedFileId, tab } = useSource();
  if (plugin) return <PluginDocs />
  if (selectedFileId) return <FileContentViewer />
  if (tab === Tab.ADD_SOURCE) return <UnselectedPlugin />
  return <UnselectedFile />
}