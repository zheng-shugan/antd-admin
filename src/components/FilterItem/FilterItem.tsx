import React from 'react'
import styles from './FilterItem.less'
import { FilterItemProps } from '@/types'

const FilterItem = ({ label = '', children }: FilterItemProps) => {
  const labelArray = label.split('')
  return (
    <div className={styles.filterItem}>
      {labelArray.length > 0 && (
        <div className={styles.labelWrap}>
          {labelArray.map((item, index) => (
            <span className="labelText" key={index}>
              {item}
            </span>
          ))}
        </div>
      )}
      <div className={styles.item}>{children}</div>
    </div>
  )
}

export default FilterItem
