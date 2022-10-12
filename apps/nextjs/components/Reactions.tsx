import {Button, createStyles} from '@mantine/core'
import {IconHeart, IconThumbDown, IconThumbUp} from '@tabler/icons'
import {useState} from 'react'

export interface ReactionsProps {
  postId: number
  reactions: {
    like?: number
    dislike?: number
    love?: number
  }
}

const Icons = [
  {
    label: 'like',
    icon: <IconThumbUp />
  },
  {
    label: 'dislike',
    icon: <IconThumbDown />
  },
  {
    label: 'love',
    icon: <IconHeart />
  }
]

const useStyles = createStyles((theme) => ({
  reactions: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: theme.spacing.sm,

    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'row'
    },

    '& button': {
      border: `1px solid ${theme.colors.dark[2]}`,
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[3]
          : theme.colors.dark[6],
      height: 42,
      marginBottom: theme.spacing.md,
      marginTop: theme.spacing.xs,
      paddingLeft: theme.spacing.sm,
      paddingRight: theme.spacing.sm,

      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[8]
            : theme.fn.lighten(theme.colors.dark[0], 0.6)
      },

      [theme.fn.smallerThan('sm')]: {
        marginRight: theme.spacing.xs,
        marginBottom: 0
      }
    }
  }
}))

/**
 * Reactions component.
 */
export default function Reactions({postId, reactions}: ReactionsProps) {
  const {classes} = useStyles()
  const [postReactions, setPostReactions] = useState(reactions)
  const [loading, setLoading] = useState('')

  /**
   * Increment the number of reactions.
   */
  async function incrementReaction(name: string, total: number) {
    setLoading(name)
    try {
      const response = await fetch(
        `/api/wordpress/reactions?postId=${postId}&reaction=${name}&total=${
          total + 1
        }`,
        {
          method: 'POST'
        }
      )

      if (response.status != 200) {
        throw new Error('Failed to increment reaction.')
      }

      const data = await response.json()

      if ('success' != data.message) {
        throw new Error('Failed to increment reaction.')
      }

      setPostReactions(data?.reactions)
      setLoading('')
    } catch (error) {
      console.error(error)
      setLoading('')
    }
  }

  return (
    <aside className={classes.reactions}>
      {!!postReactions &&
        Object.entries(postReactions).map((reaction, index) => {
          // Skip the typename def which comes from GraphQL.
          if (reaction[0] === '__typename') {
            return null
          }

          // Set vars...
          const label = reaction[0]
          const total = reaction[1]

          return (
            <Button
              aria-label={label}
              key={index}
              leftIcon={Icons.find((icon) => icon.label === label)?.icon}
              loading={loading === label ? true : false}
              onClick={() => incrementReaction(label, total)}
              size="md"
              type="button"
              variant="outline"
            >
              {total >= 1 ? total : 0}
            </Button>
          )
        })}
    </aside>
  )
}
