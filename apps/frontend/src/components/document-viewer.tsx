import { useApiQuery } from '@/hooks/use-api-query';

type RemoteDocumentViewerProps = {
  type: "remote";
  sourceId: string;
}
type LocalDocumentViewerProps = {
  type: "local";
  file: File;
}
type Props = RemoteDocumentViewerProps | LocalDocumentViewerProps

export const DocumentViewer = (props: Props) => {
  if (props.type === "remote") {
    return <RemoteDocumentViewer {...props} />
  } else {
    return <LocalDocumentViewer {...props} />
  }
}

const RemoteDocumentViewer = ({ sourceId }: RemoteDocumentViewerProps) => {
  const { data } = useApiQuery("/api/knowledge/:knowledgeSlug/source/:sourceId/view", { method: "GET", params: { sourceId } });

  return (
    <iframe src={data?.url} width={"100%"} height={"100%"} />
  )
}

const LocalDocumentViewer = (props: LocalDocumentViewerProps) => {
  return (
    <iframe src={props.type}/>
  )
}