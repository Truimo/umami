import { Team } from '@prisma/client';
import { NextApiRequestQueryBody } from 'lib/types';
import { useAuth } from 'lib/middleware';
import { NextApiResponse } from 'next';
import { methodNotAllowed, ok, notFound } from 'next-basics';
import { createTeamUser, getTeam } from 'queries';
import { ROLES } from 'lib/constants';

export interface TeamsJoinRequestBody {
  accessCode: string;
}

export default async (
  req: NextApiRequestQueryBody<any, TeamsJoinRequestBody>,
  res: NextApiResponse<Team>,
) => {
  await useAuth(req, res);

  if (req.method === 'POST') {
    const { accessCode } = req.body;

    const team = await getTeam({ accessCode });

    if (!team) {
      return notFound(res, 'message.team-not-found');
    }

    await createTeamUser(req.auth.user.id, team.id, ROLES.teamMember);

    return ok(res, team);
  }

  return methodNotAllowed(res);
};