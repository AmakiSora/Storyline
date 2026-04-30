type GraphQLError = {
  message: string
}

type GraphQLResponse<T> = {
  data?: T
  errors?: GraphQLError[]
}

const DEFAULT_ENDPOINT = 'http://localhost:4000/graphql'

export async function requestGraphQL<TData, TVars extends Record<string, unknown> | undefined>(
  query: string,
  variables?: TVars,
  endpoint = DEFAULT_ENDPOINT,
): Promise<TData> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) {
    throw new Error(`GraphQL 请求失败：${res.status}`)
  }

  const json = (await res.json()) as GraphQLResponse<TData>
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('\n'))
  }
  if (!json.data) throw new Error('GraphQL 响应缺少 data')
  return json.data
}

