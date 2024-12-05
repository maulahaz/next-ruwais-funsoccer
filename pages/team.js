import { PrismaClient } from "@prisma/client";

// export async function loader() {
//   const prisma = new PrismaClient();
//   const allTeams = await prisma.team.findMany();
//   console.log("Teams: ", allTeams);
//   await prisma.$disconnect();

//   return allTeams;
// }

export default async function team() {
  const prisma = new PrismaClient();
  const allTeams = await prisma.team.findMany();
  console.log("Teams: ", allTeams);
  await prisma.$disconnect();
  
  return <div>team</div>;
}
