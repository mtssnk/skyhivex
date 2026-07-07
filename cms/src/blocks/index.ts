import { Hero, heroFields } from './Hero'
import { CTA } from './CTA'
import { MediaText } from './MediaText'
import { Media } from './Media'
import { Quote } from './Quote'
import { BodyCopy } from './BodyCopy'
import { PersonList } from './PersonList'
import { AccordionList } from './AccordionList'
import { CardList } from './CardList'
import { ProjectList } from './ProjectList'
import { NewsCardList } from './NewsCardList'
import { LogoList } from './LogoList'
import { FeatureList } from './FeatureList'
import { LinkedContent } from './LinkedContent'
import { NavBlock } from './NavBlock'

export { heroFields }

const baseBlocks = [
  MediaText,
  Media,
  Quote,
  BodyCopy,
  CTA,
  PersonList,
  AccordionList,
  CardList,
  ProjectList,
  NewsCardList,
  LogoList,
  NavBlock,
]

export const pageBlocks = [Hero, ...baseBlocks, FeatureList, LinkedContent]
export const postBlocks = [...baseBlocks, LinkedContent]
export const projectBlocks = [...baseBlocks, LinkedContent]
export const projectsPageBlocks = [...baseBlocks, FeatureList]
