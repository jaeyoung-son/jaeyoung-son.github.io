// @flow
import React from 'react';
import { Link } from 'gatsby';
import cx from 'classnames';
import styles from './Tags.module.scss';

type Props = {
  tags: string[],
  tagSlugs: string[],
  inSidebar?: boolean
};

const Tags = ({ tags, tagSlugs, inSidebar }: Props) => (
  <div className={styles['tags']}>
    <ul className={styles['tags__list']}>
      {tagSlugs && tagSlugs.map((slug, i) => (
        <li
          className={cx(
            styles['tags__list-item'],
            inSidebar && styles['tags_insidebar__list-item']
          )}
          key={tags[i]}
        >
          <Link
            to={slug}
            className={cx(
              styles['tags__list-item-link'],
              inSidebar && styles['tags_insidebar__list-item-link']
            )}
          >
            {tags[i]}
          </Link>
        </li>
      ))}
      {['wecode', '재영블로그'].map((name) => (
        <li
          className={cx(
            styles['tags__list-item'],
            inSidebar && styles['tags_insidebar__list-item']
          )}
          key={name}
        >
          <span
            className={cx(
              styles['tags__list-item-link'],
              inSidebar && styles['tags_insidebar__list-item-link']
            )}
          >
            {name}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

export default Tags;
