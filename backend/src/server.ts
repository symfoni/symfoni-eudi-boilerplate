import { normalizePresentation } from "did-jwt-vc";
import * as express from "express";
import * as cors from "cors";
import { Request, Response } from "express";
import { Connection } from "typeorm";
import { VeramoService } from "./veramo/veramo.service";
import { getDbConnection } from "./veramo/veramo.utils";

export const createServer = async (
  dbConnection: Promise<Connection> = getDbConnection("veramo.db.sqlite")
) => {
  const app: express.Application = express();
  app.use(express.json());
  app.use(cors());

  const veramoService = new VeramoService(dbConnection);
  await veramoService.init();

  const users = [
    {
      name: "Ola nordmann",
      personnummer: 12345678910,
    },
  ];

  app.post(
    "/credential/identity/:personnummer",
    async (req: Request, res: Response) => {
      const personnumer = parseInt(req.params.personnummer);
      if (isNaN(personnumer)) throw new Error("Not valid");
      const _user = users.find((user) => user.personnummer === personnumer);

      if (_user !== undefined) {
        const subject = `${process.env.DID_NAMESPACE}:0x0260cc4eb9ce0614f920d3f47cfe4a5b177d64a00e04c50fdf392b1ada891aa675`;
        const vc = await veramoService.issueCredential(_user, subject, [
          "IdentityCredential",
        ]);
        res.send(vc);
      } else {
        res.status(400);
        res.send({ message: "user not found with this personummer" });
      }
    }
  );

  const employees = [
    {
      name: "Ola nordmann",
      personnummer: 12345678910,
      employeedDate: "12.02.2020",
      type: "fulltime",
      salary: 500000,
    },
  ];

  app.post("/credential/employee/", async (req: Request, res: Response) => {
    const { jwt } = req.body;
    const vp = await normalizePresentation(jwt);
    const validVp = await veramoService.validVP(vp.proof.jwt);
    const validJwt = await veramoService.verifyJWT(jwt);
    console.log("jwt", jwt);
    console.log("vp", vp);
    console.log("valid vp", validVp);
    console.log("validJWT", validJwt);
    const personnummer = vp.vc.credentialSubject.personnummer;
    const employee = employees.find((emp) => emp.personnummer === personnummer);
    if (employee === undefined) {
      res.status(400);
      res.send({ message: "Cant fint employees with this identity" });
    } else {
      res.status(200);
      const subject: string = vp.sub;
      res.send(
        await veramoService.issueCredential(employee, subject, [
          "EmployeeCredential",
        ])
      );
    }
  });

  return { veramoService, app };
};
