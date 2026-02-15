// import React from 'react'
// import mysql from 'mysql2/promise'
// import { NextResponse } from 'next/server';
//     const connection = await mysql.createPool({
//         host:"localhost",
//         user:"root",
//         database:"MeetingManagementDB",
//         password:"qwef@#12"
//     });
// export default async function db() {
//     const [rows] = await connection.query("select * from MeetingType");
//     return rows;
// }

// lib/db.ts
import mysql from 'mysql2/promise';

export const pool = await mysql.createPool({
  host: "localhost",
  user: "root",
  database: "MeetingManagementDB",
  password: "qwef@#12",
});

// export async function db() {
//   const [rows] = await connection.query("select * from MeetingType");
//   return rows as any[]; 
// }

