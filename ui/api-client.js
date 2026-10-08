export async function api(path, options) {
  const response = await fetch(`/api${path}`, options);
  const body = await response.json();
  if (!response.ok) {
    throw Object.assign(
      new Error(body.error ?? 'Unable to complete the request.'),
      body.conflicts ? { conflicts: body.conflicts } : {}
    );
  }
  return body;
}
