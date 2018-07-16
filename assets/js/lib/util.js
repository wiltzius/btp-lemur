import React from "react";
import {Label} from 'semantic-ui-react';

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
  if(book.author) {
    return `${book.title}, by ${book.author}`
  }
  else {
    return book.title;
  }
}


export function bookTags(books) {
  return books.map(b => <Label color="teal" key={b.id}>{stringBook(b)}</Label>);
}


export function dateFormat(stringDate) {
  return new Date(stringDate).toLocaleDateString();
}

export function bookCount(count, capitalize=false) {
  const base = capitalize ? 'Book' : 'book';
  if (count === 0) {
    return `${capitalize ? 'N' : 'n'}o ${base}s`;
  }
  else if(count === 1) {
    return `1 ${base}`;
  }
  else {
    return `${count} ${base}s`;
  }
}
