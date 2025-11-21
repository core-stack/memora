import { useSource } from '../../hooks/use-source';
import { FileContentViewer } from './file-preview';
import { UnselectedFile } from './unselected-file';

export const SourcePageContent = () => {
  const { selectedFileId } = useSource();
  if (selectedFileId) return <FileContentViewer />
  return <UnselectedFile />
}