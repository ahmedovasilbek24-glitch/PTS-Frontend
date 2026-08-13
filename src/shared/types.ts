import type { UserDto, DestinationDto, TeamDto, MomentDto, MessageDto } from './api'

export type View = 'home' | 'destinations' | 'dest-detail' | 'teams' | 'team-detail' | 'profile' | 'chat' | 'create-team' | 'community' | 'admin'
export type Theme = 'light' | 'dark'

// These mirror the pts-backend DTOs (PtsBackend.Dtos) one-to-one.
export type Destination = DestinationDto
export type Team = TeamDto
export type User = UserDto
export type Moment = MomentDto
export type Message = MessageDto