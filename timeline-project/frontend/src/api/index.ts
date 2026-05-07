/**
 * api.ts - GraphQL API 客户端
 */

import axios from 'axios'
import type { TimelineEvent, Person, CreateEventInput, UpdateEventInput } from '@/types'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql'

const graphql = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
})

// ==================== 事件 API ====================

export async function getEvents(): Promise<TimelineEvent[]> {
  const response = await graphql.post('', {
    query: `
      query GetEvents {
        events {
          id
          title
          date
          content
          image
          personId
          type
          createdAt
          updatedAt
        }
      }
    `
  })
  return response.data.data.events
}

export async function getEventById(id: string): Promise<TimelineEvent> {
  const response = await graphql.post('', {
    query: `
      query GetEvent($id: ID!) {
        event(id: $id) {
          id
          title
          date
          content
          image
          personId
          type
          createdAt
          updatedAt
        }
      }
    `,
    variables: { id }
  })
  return response.data.data.event
}

export async function createEvent(input: CreateEventInput): Promise<TimelineEvent> {
  const response = await graphql.post('', {
    query: `
      mutation CreateEvent($input: CreateEventInput!) {
        createEvent(input: $input) {
          id
          title
          date
          content
          image
          personId
          type
          createdAt
          updatedAt
        }
      }
    `,
    variables: { input }
  })
  return response.data.data.createEvent
}

export async function updateEvent(id: string, input: UpdateEventInput): Promise<TimelineEvent> {
  const response = await graphql.post('', {
    query: `
      mutation UpdateEvent($id: ID!, $input: UpdateEventInput!) {
        updateEvent(id: $id, input: $input) {
          id
          title
          date
          content
          image
          personId
          type
          createdAt
          updatedAt
        }
      }
    `,
    variables: { id, input }
  })
  return response.data.data.updateEvent
}

export async function deleteEvent(id: string): Promise<void> {
  await graphql.post('', {
    query: `
      mutation DeleteEvent($id: ID!) {
        deleteEvent(id: $id)
      }
    `,
    variables: { id }
  })
}

// ==================== 人物 API ====================

export async function getPersons(): Promise<Person[]> {
  const response = await graphql.post('', {
    query: `
      query GetPersons {
        persons {
          id
          name
          color
          icon
        }
      }
    `
  })
  return response.data.data.persons
}

// 导出实例
export const api = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getPersons
}
