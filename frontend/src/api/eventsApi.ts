import { requestGraphQL } from './graphqlClient'
import type { EventFilter, TimelineEvent } from '@/types/event'

const EventsQuery = `
  query Events($filter: EventFilterInput) {
    events(filter: $filter) {
      id
      title
      date
      content
      image
      person
      type
    }
  }
`

const CreateEventMutation = `
  mutation CreateEvent($input: EventInput!) {
    createEvent(input: $input) {
      id
      title
      date
      content
      image
      person
      type
    }
  }
`

const UpdateEventMutation = `
  mutation UpdateEvent($id: ID!, $input: EventInput!) {
    updateEvent(id: $id, input: $input) {
      id
      title
      date
      content
      image
      person
      type
    }
  }
`

const DeleteEventMutation = `
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id)
  }
`

export async function fetchEvents(filter?: EventFilter) {
  const data = await requestGraphQL<{ events: TimelineEvent[] }, { filter?: EventFilter }>(EventsQuery, {
    filter,
  })
  return data.events
}

export async function createEvent(input: Omit<TimelineEvent, 'id'>) {
  const data = await requestGraphQL<{ createEvent: TimelineEvent }, { input: Omit<TimelineEvent, 'id'> }>(
    CreateEventMutation,
    { input },
  )
  return data.createEvent
}

export async function updateEvent(id: string, input: Omit<TimelineEvent, 'id'>) {
  const data = await requestGraphQL<
    { updateEvent: TimelineEvent },
    { id: string; input: Omit<TimelineEvent, 'id'> }
  >(UpdateEventMutation, { id, input })
  return data.updateEvent
}

export async function deleteEvent(id: string) {
  const data = await requestGraphQL<{ deleteEvent: boolean }, { id: string }>(DeleteEventMutation, { id })
  return data.deleteEvent
}

