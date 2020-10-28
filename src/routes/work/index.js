import React, { Suspense } from 'react'
import {
  useLocation,
  useHistory
} from 'react-router-dom'
import bcrypt from 'bcryptjs'

const KEY = '$2a$10$USQuR2gaKa46XiJhOAmuJeyxT7BkawlpDpEdtYUmruIDzPGTZIR2q'

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery () {
  return new URLSearchParams(useLocation().search)
}

const Work = () => {
  const query = useQuery()
  const history = useHistory()
  const accessToken = query.get('accessToken') || ''
  const seed = query.get('seed') || (Math.random() * 100)

  if (!bcrypt.compareSync(accessToken, KEY)) {
    history.push('/')
  }

  const Canvas = React.lazy(() => import('../../canvas/' + query.get('canvas')))
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Canvas seed={seed} />
      </Suspense>
    </>
  )
}

Work.propTypes = {

}

export default Work
