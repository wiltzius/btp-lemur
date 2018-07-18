import React from "react";
import {Label, List} from 'semantic-ui-react';

export function unorderedList(items) {
  return <ul>
    {
      items.map(item => {
        return <li key={item}>{item}</li>
      })
    }
  </ul>
}

export function stringBook(book) {
  if (book.author) {
    return <span>{book.title} <em>by</em> {book.author}</span>
  }
  else {
    return <span>{book.title}</span>;
  }
}


function bookTag(book) {
  return <Label color="teal"
                key={book.id}>
    {stringBook(book)}
  </Label>
}


export function bookTags(books) {
  return books.map(b => bookTag(b));
}

export function bookTagsList(books) {
  return books.map(b => <List.Item key={b.id}>{bookTag(b)}</List.Item>)
}


export function dateFormat(stringDate) {
  return new Date(stringDate).toLocaleDateString();
}

export function bookCount(count, capitalize = false) {
  const base = capitalize ? 'Book' : 'book';
  if (count === 0) {
    return `${capitalize ? 'N' : 'n'}o ${base}s`;
  }
  else if (count === 1) {
    return `1 ${base}`;
  }
  else {
    return `${count} ${base}s`;
  }
}
