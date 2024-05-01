const apiAddress = import.meta.env.VITE_API_SERVER

export async function fetchTestData() {
  const response = await fetch(apiAddress + "/test");
  const resData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to Fetch Test Data");
  }

  return resData.data;
}

export async function addTestData(name) {
  const response = await fetch(apiAddress + "/test", {
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
  const response = await fetch(apiAddress + "/redis/test");
  const resData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to Fetch Redis Test Data");
  }

  return resData.data;
}

export async function addRedisTestData(redisName) {
  const response = await fetch(apiAddress + "/redis/test", {
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
