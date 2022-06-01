
const getRecommendedJobs = (
   allJobs,
   devTechs
) => {
   let filteredJobs = [];

   let devTechStack = [];
   devTechs.forEach((item) => {
      const { technology, yearsOfExperience } =
         item || {};

      if (technology && yearsOfExperience) {
         devTechStack.push({
            id: technology._id.toString(),
            yearsOfExperience,
         });
      }
   });

   // Tengo todas las tecnologías que piden en la oferta?
   for (let i = 0; i < allJobs.length; i++) {
      let addJob = true;
      const job = allJobs[i];

      // Extrae solo el ID
      // IDS de tecnologias y años
      const { techsRequired } = job;
      let techsRequiredFormated = [];
      techsRequired.forEach((item) => {
         const { technology, yearsOfExperience } =
            item || {};

         // (por si el admin borro alguna)
         if (technology) {
            techsRequiredFormated.push({
               id: technology._id.toString(),
               yearsOfExperience,
            });
         }
      });

      // Si no se solicita nada o el usuario no tiene tecnologias
      // de plano no se agrega
      if (
         devTechStack.length === 0 ||
         techsRequiredFormated === 0
      ) {
         addJob = false;
      } 
      else {
         
         techsRequiredFormated.forEach(tech => {
            const devCurrentTechnology = devTechStack.find((devTech) => devTech.id === tech.id);
            const devHasTech = devCurrentTechnology !== undefined;

            if(!devHasTech) {
               addJob = false;
               return;
            }

            // Si la tiene, revisar los años de experiencia
            if(! (devCurrentTechnology.yearsOfExperience >= tech.yearsOfExperience) ) {
               addJob = false;
               return;
            }
         })
      }

      if (addJob) {
         filteredJobs.push(job);
      }
   }

   return filteredJobs;
};

// Extrae SOLO los trabajos que tengan tecnologias existentes

//const getRecommendedJobs = (allJobs, devTechs) => {
//   let techs = [];

//   devTechs.map(item => {
//      const { technology, yearsOfExperience } = item || {};

//      if(technology && yearsOfExperience) {
//         techs.push({
//            id: technology._id.toString(),
//            yearsOfExperience
//         });
//      }
//   });

//   let filteredJobs = [];

//   for(let i = 0; i < allJobs.length; i++) {
//      let addJob = true;

//      const job = allJobs[i];
//      const { techsRequired } = job;
//      // Extrae solo el ID

//      // IDS de tecnologias y años
//      let techsRequiredFormated = [];

//      techsRequired.forEach(item => {
//         const { technology, yearsOfExperience } = item || {};

//         // Extrae SOLO los trabajos que tengan tecnologias existentes
//         // (por si el admin borro alguna)
//         if(technology) {
//            techsRequiredFormated.push({
//               id: technology._id.toString(),
//               yearsOfExperience
//            });
//         }
//      });

//      if(techs.length === 0 || techsRequiredFormated === 0) {
//         addJob = false;
//      } else {
//         let a = 0;
//         do {
//            const RANGE = getRange(techs[a].yearsOfExperience);

//            const B = a;
//            const index = techsRequiredFormated.findIndex(element => element.id === techs[B].id);

//            // Si no incluye la tecnologia...
//            if(index === -1) {
//               addJob = false;
//               break;
//            }

//            // Si la incluye...

//            // ¿los años de experiencia estan en el rango?
//            if(!(techsRequiredFormated[index].yearsOfExperience >= RANGE.min && techsRequiredFormated[index].yearsOfExperience <= RANGE.max)) {
//               addJob = false;
//               break;
//            }
//            a++;
//         } while(a < techs.length && addJob);
//      }

//      if(addJob) {
//         filteredJobs.push(job);
//      }
//   }

//   return filteredJobs;
//};

module.exports = getRecommendedJobs;
