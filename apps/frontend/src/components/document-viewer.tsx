import { useApiQuery } from "@/hooks/use-api-query";

import type { GetUploadUrlResponse } from "@memora/schemas";

type RemoteDocumentViewerProps = {
  type: "remote";
  sourceId: string;
  knowledgeSlug: string;
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


const RemoteDocumentViewer = (props: RemoteDocumentViewerProps) => {
  const { data } = useApiQuery<GetUploadUrlResponse>(
    "/api/knowledge/:knowledge_slug/source/:source_id/view",
    { params: { knowledge_slug: props.knowledgeSlug, source_id: props.sourceId } }
  );

  return (
    <iframe src={data?.url} width={"100%"} height={"100%"} />
  )
}

const LocalDocumentViewer = (props: LocalDocumentViewerProps) => {
  return (
    <iframe src={props.type}/>
  )
}