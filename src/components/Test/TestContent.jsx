import "./TestComponents.css";

export default function TestContent({
  title,
  data,
  isLoading,
  loadingText,
  fallbackText,
}) {
  return (
    <div>
      <h3>{title}</h3>
      {isLoading && <p>{loadingText}</p>}
      {!isLoading && data.length === 0 && <p>{fallbackText}</p>}
      {!isLoading &&
        data.length > 0 &&
        data.map((items) => (
          <p id="test-content">{
            Object.values(items || {})[1]+" 안녕"
            // JSON.stringify(items)
          }
          </p>
        ))}
    </div>
  );
}
