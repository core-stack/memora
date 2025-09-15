import { useApiQuery } from "@/hooks/use-api-query";

export const AddSource = () => {
  const { data: plugins, isLoading } = useApiQuery("/api/plugin/list", { method: "GET" });
  return (
    <div>
      <ul>
        {
          !isLoading && plugins?.map((plugin) => (
            <li key={plugin.id}>{plugin.name}</li>
          ))
        }
      </ul>
    </div>
  )
}