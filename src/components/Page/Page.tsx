import React  from 'react'
import classnames from 'classnames'
import Loader from '../Loader/Loader'
import styles from './Page.less'
import { PageProps } from '@/types'

const Page = ({ className, children, loading = false, inner = false }: PageProps) => {
  const loadingStyle: any = {
    height: 'calc(100vh - 184px)',
    overflow: 'hidden',
  }

  return (
    <div
      className={classnames(className, {
        [styles.contentInner]: inner,
      })}
      style={loading ? loadingStyle : undefined}
    >
      {loading ? <Loader spinning /> : ''}
      {children}
    </div>
  )
}

export default Page
