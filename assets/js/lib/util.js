import React from "react";

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
    return `${book.author} - ${book.title}`
  }
  else {
    return book.title;
  }
}


export function dateFormat(stringDate) {
  return new Date(stringDate).toLocaleDateString();
}

export function bookCount(count, capitalize=false) {
  const base = capitalize ? 'Book' : 'book';
  if (count === 0) {
    return `No ${base}s`;
  }
  else if(count === 1) {
    return `1 ${base}`;
  }
  else {
    return `${count} ${base}s`;
  }
}
