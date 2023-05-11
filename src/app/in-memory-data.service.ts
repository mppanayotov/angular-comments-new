import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { CommentInterface } from './comment-interface';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const comments = [
      {
        id: 12,
        parentId: null,
        userId: 2,
        author: 'John',
        content: 'lorem',
        date: '03.05.2023',
        repliesIds: [13, 14, 15],
        avatar: 'assets/img/avatar.png',
      },
      {
        id: 13,
        parentId: 12,
        userId: 3,
        author: 'Peter',
        content: 'lorem',
        date: '03.05.2023',
        repliesIds: [],
        avatar: 'assets/img/avatar.png',
      },
      {
        id: 14,
        parentId: 12,
        userId: 4,
        author: 'Bob',
        content: 'lorem',
        date: '01.02.2023',
        repliesIds: [],
        avatar: 'assets/img/avatar.png',
      },
      {
        id: 15,
        parentId: 12,
        userId: 5,
        author: 'Frank',
        content: 'lorem',
        date: '03.05.2023',
        repliesIds: [],
        avatar: 'assets/img/avatar.png',
      },
      {
        id: 16,
        parentId: null,
        userId: 6,
        author: 'Joseph',
        content: 'lorem',
        date: '02.05.2023',
        repliesIds: [],
        avatar: 'assets/img/avatar.png',
      },
      {
        id: 17,
        parentId: null,
        userId: 7,
        author: 'Emma',
        content: 'lorem',
        date: '01.05.2023',
        repliesIds: [],
        avatar: 'assets/img/avatar.png',
      },
      {
        id: 18,
        parentId: null,
        userId: 8,
        author: 'Stan',
        content: 'lorem',
        date: '02.05.2022',
        repliesIds: [],
        avatar: 'assets/img/avatar.png',
      },
      {
        id: 19,
        parentId: null,
        userId: 9,
        author: 'George',
        content: 'lorem',
        date: '04.05.2021',
        repliesIds: [],
        avatar: 'assets/img/avatar.png',
      },
      {
        id: 20,
        parentId: null,
        userId: 0,
        author: 'Larry',
        content: 'lorem',
        date: '01.05.2020',
        repliesIds: [],
        avatar: 'assets/img/avatar.png',
      },
    ];
    return { comments };
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the comments array is empty,
  // the method below returns the initial number (11).
  // if the comments array is not empty, the method below returns the highest
  // hero id + 1.
  genId(comments: CommentInterface[]): number {
    return comments.length > 0
      ? Math.max(...comments.map((comment) => comment.id)) + 1
      : 11;
  }
}
