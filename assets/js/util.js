/**
 * Created by tom on 7/10/17.
 */

import * as React from "react";

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
