export async function fetchTestData() {
  const response = await fetch("http://43.200.165.75:8080/test");
  const resData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to Fetch Test Data");
  }

  return resData.data;
}

export async function addTestData(name) {
  const response = await fetch("http://43.200.165.75:8080/test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  const resData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to Fetch Test Data");
  }

  return resData.message;
}

export async function fetchRedisTestData() {
  const response = await fetch("http://43.200.165.75:8080/redis/test");
  const resData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to Fetch Redis Test Data");
  }

  return resData.data;
}

export async function addRedisTestData(redisName) {
  const response = await fetch("http://43.200.165.75:8080/redis/test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ redisName }),
  });

  const resData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to Fetch Redis Test Data");
  }

  return resData.message;
}
