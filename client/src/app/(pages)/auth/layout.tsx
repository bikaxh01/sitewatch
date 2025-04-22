import React, { ReactNode } from 'react'

function layout({children}:{children:ReactNode}) {
  return (
    <div className='  h-screen flex w-full items-center justify-center'>

        {children}
    </div>
  )
}

export default layout