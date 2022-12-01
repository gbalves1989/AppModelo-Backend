export type CreateBookDTO = {
  title: string
  year: string
  authorId: string
  publisherId: string
}

export type ShowBookDTO = {
  id: string
}

export type UpdateBookDTO = {
  title: string
  year: string
}

export type DeleteBookDTO = {
  id: string
}
