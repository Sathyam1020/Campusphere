'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React, { useCallback, useEffect, useRef, useState } from 'react'

type Project = {
  id: string
  title: string
  author?: string
  description?: string
  tech?: string[]
}

const DUMMY: Project[] = [
  { id: 'p1', title: 'Campus Chat App', author: 'Alice', description: 'A realtime chat app for students', tech: ['React', 'Socket'] },
  { id: 'p2', title: 'Study Buddy Matcher', author: 'Bob', description: 'Match students with similar study habits', tech: ['Next.js', 'TypeScript'] },
  { id: 'p3', title: 'Hackathon Planner', author: 'Cara', description: 'Plan hackathon teams & events', tech: ['Node', 'Prisma'] },
  { id: 'p4', title: 'Resume Builder', author: 'Dan', description: 'Make beautiful resumes in minutes', tech: ['Tailwind', 'React'] },
]

const THRESHOLD = 120 // px to trigger like/reject

const FindProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(DUMMY)
  const [liked, setLiked] = useState<Project[]>([])
  const [accepted, setAccepted] = useState<Project[]>([])
  const [activeTab, setActiveTab] = useState<string>('find')

  // drag state
  const dragRef = useRef<{
    id: string | null
    startX: number
    startY: number
    currentX: number
    currentY: number
    dragging: boolean
  }>({ id: null, startX: 0, startY: 0, currentX: 0, currentY: 0, dragging: false })

  // per-card transforms stored in state keyed by id for render
  const [transforms, setTransforms] = useState<Record<string, { x: number; y: number; rot: number; isAnimating?: boolean }>>({})

  useEffect(() => {
    // initialize transforms for list
    const map: Record<string, { x: number; y: number; rot: number }> = {}
    projects.forEach((p, i) => {
      map[p.id] = { x: 0, y: 0, rot: 0 }
    })
    setTransforms(map)
  }, [projects])

  const topProject = projects[projects.length - 1]

  const startDrag = useCallback((e: React.PointerEvent, id: string) => {
    ; (e.target as Element).setPointerCapture(e.pointerId)
    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      currentX: 0,
      currentY: 0,
      dragging: true,
    }
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.dragging || !dragRef.current.id) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    dragRef.current.currentX = dx
    dragRef.current.currentY = dy
    const rot = Math.max(-25, Math.min(25, (dx / window.innerWidth) * 50))
    setTransforms(prev => ({ ...prev, [dragRef.current.id as string]: { x: dx, y: dy, rot } }))
  }, [])

  const endDrag = useCallback(() => {
    const info = dragRef.current
    if (!info.dragging || !info.id) return
    const dx = info.currentX
    const id = info.id
    info.dragging = false

    if (Math.abs(dx) > THRESHOLD) {
      const toRight = dx > 0
      // animate offscreen
      const offX = (toRight ? window.innerWidth : -window.innerWidth) * 1.2
      setTransforms(prev => ({ ...prev, [id]: { x: offX, y: info.currentY, rot: toRight ? 30 : -30, isAnimating: true } }))

      // remove after transition
      setTimeout(() => {
        setProjects(prev => prev.filter(p => p.id !== id))
        const project = projects.find(p => p.id === id)
        if (project) {
          if (toRight) setLiked(prev => [project, ...prev])
          // left swipe = reject => do nothing (maybe in future save)
        }
        // cleanup transform
        setTransforms(prev => {
          const copy = { ...prev }
          delete copy[id]
          return copy
        })
      }, 300)
    } else {
      // revert
      setTransforms(prev => ({ ...prev, [id]: { x: 0, y: 0, rot: 0, isAnimating: true } }))
      setTimeout(() => {
        setTransforms(prev => ({ ...prev, [id]: { x: 0, y: 0, rot: 0 } }))
      }, 300)
    }

    dragRef.current.id = null
  }, [projects])

  // programmatic actions: only 'left' (reject) or 'right' (like)
  const swipe = useCallback((id: string, direction: 'left' | 'right') => {
    const toRight = direction === 'right'
    const offX = (toRight ? window.innerWidth : -window.innerWidth) * 1.2
    setTransforms(prev => ({ ...prev, [id]: { x: offX, y: 0, rot: toRight ? 25 : -25, isAnimating: true } }))
    setTimeout(() => {
      setProjects(prev => prev.filter(p => p.id !== id))
      const project = projects.find(p => p.id === id)
      if (project) {
        if (direction === 'right') setLiked(prev => [project, ...prev])
        // Reject (left) does not store project locally
      }
      setTransforms(prev => {
        const copy = { ...prev }
        delete copy[id]
        return copy
      })
    }, 300)
  }, [projects])

  // small card renderer using shadcn Card styles for dark/light compatibility
  const renderCard = (p: Project, index: number) => {
    const isTop = index === projects.length - 1
    const style = transforms[p.id] || { x: 0, y: 0, rot: 0 }
    const transition = style.isAnimating ? 'transform 300ms ease' : undefined

    const stackIndex = projects.length - 1 - index

    return (
      <Card
        key={p.id}
        onPointerDown={e => isTop && startDrag(e, p.id)}
        onPointerMove={isTop ? onPointerMove : undefined}
        onPointerUp={isTop ? endDrag : undefined}
        onPointerCancel={isTop ? endDrag : undefined}
        className="absolute left-1/2 top-0 w-[320px] h-[420px] -translate-x-1/2 touch-none p-4"
        style={{
          transform: `translate(${style.x}px, ${style.y}px) rotate(${style.rot}deg) scale(${1 - stackIndex * 0.03})`,
          transition,
          zIndex: 50 - stackIndex,
        }}
      >
        <CardHeader>
          <CardTitle>{p.title}</CardTitle>
          <CardDescription className="text-sm">{p.author}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="text-sm text-muted-foreground">{p.description}</div>
        </CardContent>
        <CardFooter className="gap-2">
          <div className="flex flex-wrap gap-2">
            {p.tech?.map(t => (
              <div key={t} className="rounded-full bg-muted/40 px-3 py-1 text-xs text-muted-foreground">{t}</div>
            ))}
          </div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Find Projects</h2>
      </div>

      <Tabs value={activeTab} onValueChange={v => setActiveTab(v)}>
        <TabsList>
          <TabsTrigger value="find">Find</TabsTrigger>
          <TabsTrigger value="liked">Liked ({liked.length})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({accepted.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="find">
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-[360px] h-[440px] mt-4">
              {projects.length === 0 && (
                <div className="p-6 text-center text-muted-foreground">No more projects</div>
              )}
              {projects.map((p, i) => renderCard(p, i))}
            </div>

            {topProject && (
              <div className="flex gap-3 mt-5">
                <Button variant="ghost" size="sm" onClick={() => swipe(topProject.id, 'left')}>Reject</Button>
                <Button variant="default" size="sm" onClick={() => swipe(topProject.id, 'right')}>Like</Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="liked">
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-3">Liked Projects</h3>
            {liked.length === 0 ? (
              <div className="text-muted-foreground">No liked projects yet</div>
            ) : (
              <ul className="space-y-2">
                {liked.map(p => (
                  <li key={p.id} className="p-3 bg-card/50 rounded-md">{p.title} — {p.author}</li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>

        <TabsContent value="accepted">
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-3">Accepted Projects</h3>
            {accepted.length === 0 ? (
              <div className="text-muted-foreground">No accepted projects yet</div>
            ) : (
              <ul className="space-y-2">
                {accepted.map(p => (
                  <li key={p.id} className="p-3 bg-card/50 rounded-md">{p.title} — {p.author}</li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default FindProjects
