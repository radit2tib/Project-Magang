--
-- PostgreSQL database dump
--

\restrict oMUmMpiyW7fHiWb2z7fTumZexRuNe2rYxOy2h8R5RpwFUXCqZTENDOidLQf8Lq4

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.3

-- Started on 2026-06-13 00:55:44

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 16656)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 5048 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16686)
-- Name: Mahasiswa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Mahasiswa" (
    nim text NOT NULL,
    nama text NOT NULL,
    password character varying(255) NOT NULL,
    angkatan integer NOT NULL,
    bu text,
    dept text,
    "jenisKelamin" text,
    scholar text,
    english text,
    "judulKp" text,
    "judulTa" text,
    "pakaiKacamata" boolean,
    "riwayatPenyakit" text,
    "isProfileComplete" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT now() NOT NULL,
    mentor text,
    co_mentor text,
    "fileLaporanKp" text,
    "fileLaporanTa" text,
    "komenKp" text,
    "komenTa" text,
    "nilaiKpAkhir" double precision,
    "nilaiKpMentor" double precision,
    "nilaiKpPenguji" double precision,
    "nilaiTaAkhir" double precision,
    "nilaiTaMentor" double precision,
    "nilaiTaPenguji" double precision
);


ALTER TABLE public."Mahasiswa" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 17094)
-- Name: Tugas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tugas" (
    id integer NOT NULL,
    "taskNumber" text NOT NULL,
    "judulTugas" text NOT NULL,
    "fileLaporan" text NOT NULL,
    "filePresentasi" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    nim_mahasiswa text NOT NULL,
    nilai integer
);


ALTER TABLE public."Tugas" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 17093)
-- Name: Tugas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Tugas_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Tugas_id_seq" OWNER TO postgres;

--
-- TOC entry 5050 (class 0 OID 0)
-- Dependencies: 223
-- Name: Tugas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Tugas_id_seq" OWNED BY public."Tugas".id;


--
-- TOC entry 219 (class 1259 OID 16657)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16672)
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    nama_lengkap text NOT NULL,
    username text NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16671)
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admins_id_seq OWNER TO postgres;

--
-- TOC entry 5051 (class 0 OID 0)
-- Dependencies: 220
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- TOC entry 4876 (class 2604 OID 17097)
-- Name: Tugas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tugas" ALTER COLUMN id SET DEFAULT nextval('public."Tugas_id_seq"'::regclass);


--
-- TOC entry 4871 (class 2604 OID 16675)
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- TOC entry 5040 (class 0 OID 16686)
-- Dependencies: 222
-- Data for Name: Mahasiswa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Mahasiswa" (nim, nama, password, angkatan, bu, dept, "jenisKelamin", scholar, english, "judulKp", "judulTa", "pakaiKacamata", "riwayatPenyakit", "isProfileComplete", "createdAt", "updatedAt", mentor, co_mentor, "fileLaporanKp", "fileLaporanTa", "komenKp", "komenTa", "nilaiKpAkhir", "nilaiKpMentor", "nilaiKpPenguji", "nilaiTaAkhir", "nilaiTaMentor", "nilaiTaPenguji") FROM stdin;
2307011431	Wenny gusmala dewi	123456	2023	APR	Dryer	perempuan	Non Scholar	Beginner	\N	\N	f	 	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Afri Jasman	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307011433	Yelia	123456	2023	APR	Dryer	perempuan	Non Scholar	Intermediate	\N	\N	f	 	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Afri Jasman	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307011434	Tahnia Rahmawati 	123456	2023	APR	Spinbath	perempuan	Non Scholar	Beginner	\N	\N	f	 	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Davit Susanto	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307011435	Monica Fitri 	123456	2023	APR	Spinbath	perempuan	Non Scholar	Intermediate	\N	\N	t	 	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Muhammad Maulana	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307026358	Sisca Pinasthi Putri 	123456	2023	APR	CP	perempuan	Non Scholar	Beginner	\N	\N	t	Skoliosis 	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Azwar Yani	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307026359	INNESA QABLI RAMDINI	123456	2023	APR	CP	perempuan	Non Scholar	Intermediate	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Azwar Yani	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307027380	Difa Damayanti 	123456	2023	APR	CP	perempuan	Non Scholar	Intermediated	\N	\N	t	Maag	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Azwar Yani	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307014398	Haiva Kerin Dini 	123456	2023	Board	Finishing	perempuan	Non Scholar	Intermediated	\N	\N	t	Gerd, ISPA	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Ranbir Singh	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307014402	Herwika Juliana	123456	2023	Board	Finishing	perempuan	Non Scholar	Intermediated	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Ranbir Singh	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307026239	Yolanda Putri	123456	2023	Board	Finishing	perempuan	Non Scholar	Beginner	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Iyus Timotius	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307026240	IKHSAN MAULANA AMSYAH	123456	2023	Board	Finishing	perempuan	Non Scholar	Intermediated	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Iyus Timotius	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307037452	Pretty Lily Joyce 	123456	2023	Board	Technical	perempuan	Scholars	Beginner	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Putu Hendriawan	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307037455	Hana Anggun kartika Sari	123456	2023	Board	WEC & CCK	perempuan	Scholars	Beginner	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Ahmad Fadillah	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307037456	Fiska Saputri 	123456	2023	Board	WEC & CCK	perempuan	Scholars	Intermediated	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Ahmad Fadillah	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307014403	Muhammad Mustaqim Ash-Shiddiq	123456	2023	Board	Technical	laki-laki	Non Scholar	Beginner	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Ratna Kumalasari	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307014404	TENGKU DHANI ZHAFRAN	123456	2023	Board	BM	laki-laki	Non Scholar	Intermediate	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Mahathma Wira Gandapraja	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307026241	Slamet Mujiono Wibowo 	123456	2023	Board	BM	laki-laki	Non Scholar	Beginner	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Mahathma Wira Gandapraja	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307026357	Egi Syafikri	123456	2023	Board	BM	laki-laki	Non Scholar	Intermediate	\N	\N	t	maag	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Mahathma Wira Gandapraja	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307012172	MUHAMMAD FARHAN MAHFUUZHI	123456	2023	Paper	Finishing	laki-laki	Non Scholar	Intermediate	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	M. Nur Abdul Jais	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307012743	Muhammad Rasyid	123456	2023	Paper	Finishing	laki-laki	Non Scholar	Intermediated	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Akhir Malayu	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307013686	MHD. Rizqi Arif Denafdi	123456	2023	Paper	IHP	laki-laki	Non Scholar	Intermediate	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Muhammad Ghazali Lubis	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307014400	Hezra Vitra Ananda Tanjung	123456	2023	Paper	PM1	laki-laki	Non Scholar	Advanced	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Arada Sidabutar	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307014401	Muhammad Rafa Tri Anggara	123456	2023	Paper	PM2	laki-laki	Non Scholar	Intermediated	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Aprianto	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307014622	Azzahra Putri Kirana Manurung	123456	2023	Paper	Finishing	perempuan	Non Scholar	Intermediated	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	M. Nur Abdul Jais	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307014623	Annisa Cahyana	123456	2023	Paper	Finishing	perempuan	Non Scholar	Intermediate	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	M. Nur Abdul Jais	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307014624	Ecelly Hazizi Safitri	123456	2023	Paper	Finishing	perempuan	Non Scholar	Intermediate	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Akhir Malayu	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307014739	Gerald Regis Simanjuntak 	123456	2023	Paper	Technical	laki-laki	Scholars	Advanced	\N	\N	t	Asma	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Gusman	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307026238	Nabilla Rahmadani	123456	2023	Paper	Finishing	perempuan	Non Scholar	Intermediate	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Akhir Malayu	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307037401	Mentariani Zega	123456	2023	Paper	IHP	perempuan	Scholars	Intermediated	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Muhammad Ghazali Lubis	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307037402	Nurmalia 	123456	2023	Paper	Dry End	perempuan	Scholars	Intermediate	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Aman Silalahi	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307011952	Siti Rahma Harahap	123456	2023	Power	RKE	perempuan	Non Scholar	Beginner	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Imanuel	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307012136	Elisa Rosalina Marpaung 	123456	2023	Power	WTP	perempuan	Non Scholar	Intermediate	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Melva Tiurmada Nainggolan	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307012380	Widarti Br Tumanggor 	123456	2023	Power	Power Boiler	perempuan	Non Scholar	Intermediated	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Panahatan Rumapea & Piter Harefa	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307012493	Anggun Apriliasyah Harahap 	123456	2023	Power	Power Boiler	perempuan	Non Scholar	Intermediated	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Panahatan Rumapea & Piter Harefa	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307012933	Faizah Rusyda Sabila	123456	2023	Power	RKE	perempuan	Non Scholar	Intermediate	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Imanuel	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307012936	Putri Wulan Novianti 	123456	2023	Power	RKE	perempuan	Non Scholar	Intermediate	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Imanuel	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307013569	Gesta Maria Elena 	123456	2023	Power	WTP	perempuan	Non Scholar	Beginner	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Melva Tiurmada Nainggolan	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307014396	Shelly Allisia Siringo Ringo	123456	2023	Power	RKE	perempuan	Scholars	Intermediate	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Imanuel	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307037453	Elma Dani	123456	2023	Power	WTP	perempuan	Scholars	Intermediated	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Melva Tiurmada Nainggolan	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307037459	Ivan Martin Tampubolon	123456	2023	Power	RKE	laki-laki	Scholars	Intermediated	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Imanuel	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307011432	Eko Wahyu Kurniawan	123456	2023	Pulp	Woodyard	laki-laki	Non Scholar	Beginner	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Lamhot Sinaga	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307011436	Handika Maulana	123456	2023	Pulp	Pulp Dryer	laki-laki	Non Scholar	Intermediate	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Mulia Sentana Amir	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307011439	M. RIDHO FAUZAN. T	123456	2023	Pulp	Chemical Plant	laki-laki	Scholars	Intermediated	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Amrizal Amnur	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307011440	Sri Ramdani Harahap	123456	2023	Pulp	Woodyard	perempuan	Non Scholar	Intermediate	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Lamhot Sinaga	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307011943	KHANSA NABILA UFAIRAH 	123456	2023	Pulp	Pulp Dryer	perempuan	Non Scholar	Intermediated	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Mulia Sentana Amir	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307011429	WILDAN ALMARDLIYAH	123456	2023	Pulp	Woodyard	laki-laki	Non Scholar	intermediated	assas	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 06:47:55	Lamhot Sinaga	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307011945	ZULKIFLI	123456	2023	Pulp	Pulp Dryer	laki-laki	Non Scholar	Beginner	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Mulia Sentana Amir	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307012237	Clarisa Maria Audry Purba 	123456	2023	Pulp	Technical	perempuan	Scholars	Intermediate	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Dede Ermawan	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307014397	Tengku Atina Yuningsih	123456	2023	Pulp	Woodyard	perempuan	Scholars	Beginner	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Lamhot Sinaga	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307014399	Saidin	123456	2023	Pulp	Fiberline	laki-laki	Scholars	Intermediate	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Dimas Dwi Prasetyo Nugroho	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307014405	Michelin anatasya sitorus	123456	2023	Pulp	Woodyard	perempuan	Scholars	Intermediate	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Lamhot Sinaga	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307037400	Febiola Afrianti 	123456	2023	Pulp	Chemical Plant	perempuan	Scholars	Beginner	\N	\N	t	\N	f	2025-10-22 13:45:02.077	2025-10-22 13:45:02.077	Amrizal Amnur	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2255301190	haji	$2b$10$/hQR2QVMGUYZhhsgzAF1ve4sL2q/x2uoZ9psC/ka2CokcmgcIWjpi	2025	APR	Dryer	Belum diisi	Belum diisi	Belum diisi			f	Tidak ada	f	2025-10-22 06:51:38.107	2025-10-22 06:51:38.109	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2255301124	Muhammad Ridho	$2b$10$cIQwb15hjD.6EeUph/Qkiu8xVWINr0y5MwWcbUDmxWd1kzZqLjJJe	2022	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	2025-11-12 08:09:13.62	2025-11-12 08:09:13.621	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
235210237	najip	$2b$10$5QaONTg1myhmSireBx1Tse6fSHJHM9qfkvQHGqNzorZMZmC1Dlmkm	2023	RAK	Pulp	\N	scholar	750	\N	\N	t	-	t	2026-02-12 11:12:36.985	2026-02-12 11:14:04.744	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2255301119	raditgtgmaxx	$2b$10$Jcti/WEn8AD2PhpoitUxDun1iIjeZGTXCZ0YFnHP/raI.m92EZoAi	2023	Board	Spinbath	\N	non scholar	\N	hhh		t	tidak ada	t	2025-10-24 22:47:08.884	2025-10-24 23:06:58.569	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2531115	royyan	$2b$10$9raYbnzjKS56mD3hNRMoPutzkpAYJuMz1w5h4fZjonoTY4KidNKDm	2022	Paper	RPE	\N	non scholar	\N			t	tidak ada	t	2025-11-18 02:05:54.788	2025-11-18 02:19:34.483	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
212121	willyam thondi ghanda	$2b$10$TyrJgZJymOd/poU/yCO0ze5aTHoy1t4ORwZrAXG.S7uNlsIjUGfi6	2024	APY	Spinbath	\N	non scholar	\N			t	tidak ada	t	2025-10-26 10:17:08.344	2025-10-26 10:17:21.237	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2307011438	Angelin Loiwanta 	$2b$10$fG.GPO60RryvwUMNmY9PNeqz39QDw7TC1KMt/RXp6uXx3Nd5wHSke	2023	Paper	Dry End	perempuan	Scholars	Intermediate	rancang\n		t		t	2025-10-22 13:45:02.077	2025-12-01 07:36:03.428	Aman Silalahi	\N	uploads/laporan_kp/Angelin Loiwanta .pdf	uploads/laporan_ta/Angelin Loiwanta .pdf	aksdjasdasn	\N	80	100	40	\N	\N	\N
12221	kemal	$2b$10$by9Ca1DzwmB58u0d5yCT6eVnVe4yx5vHxX89IlW1wKRUFM6tpNvgy	2023	Board	Spinbath	\N	non scholar	\N			t	tidak ada	t	2025-10-26 10:48:01.631	2025-10-26 10:48:14.54	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2344	asd	$2b$10$9gEvdkYU/ZsGErMkvof1quV/RVJQXpKAx0tmE4rO20Kp7JrdP5QZK	2022	Board	Spinbath	\N	non scholar	\N			t	tidak ada	t	2025-10-29 02:59:14.295	2025-10-29 02:59:33.519	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2255301118	willyam thondi hasibuan	$2b$10$Kv3ISOk6C/2fjq1rQyFqSOfPMitiBzzmPwfY0yvKtfXjvH1PAkUJ.	2022	Board	GCC	\N		\N	Perancangan sistem analisis Banjir 	Perancangan analisis kertas 	f	tidak ada	t	2025-11-18 02:50:57.84	2025-11-18 03:04:38.884	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2255301196	raditgtgmaxx	$2b$10$pjrcYTdwqYm7AlIR4kp1Fu2Gc7Mp8z7W6VPmVFpMAP4IB7gPYzU5S	23	APR	GCC	perempuan	non scholar	\N			t	asma	t	2025-10-26 10:19:53.913	2025-10-26 10:20:13.887	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
22003166	awal haji	$2b$10$p5Qw3xGMJpW/17X.eCZMW.ZH9idsc3i2QuztGwgWEO2LGxO3..YX2	2025	APR	Dryer	Belum diisi	Belum diisi	Belum diisi			f	asma	t	2025-10-22 06:52:24.365	2025-10-22 06:52:24.366	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2442	feni	$2b$10$ugAo4xrUAYcWZMPxqo.Vl.wSVLvwenoOu1y8yejuQTkcjz0mOAvZK	2023	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	2025-11-12 06:51:28.712	2025-11-12 06:51:28.713	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
5504221070	Feni Wahyuni	$2b$10$0NOezwehVWeA0A6.5SweR.hRgbx.PSiypwN4JoMdoKxNMVwnBYW0O	2022	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	2025-11-12 08:04:43.161	2025-11-12 08:04:43.164	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
22871622	awal haji	$2b$10$72OmSrR8gGK3eMvqZR/zZuvts60Rx5awe7yl5ddZDwdLig8OiW8Pe	2022	APR	GCC	\N	non scholar	\N			t	asma	t	2025-10-24 12:42:55.883	2026-02-12 11:24:42.634	\N	\N	uploads/laporan_kp/awal haji.pdf	\N	\N	\N	\N	\N	\N	\N	\N	\N
5504211046	oktasya cantik	$2b$10$oi2l0VRxeeFmMBfa52X2E.Qx0He6TJrY2RgInFr41p46WHKGowI7y	2021	APR	Dryer	\N	non scholar	\N	\N	\N	t	asma	t	2025-11-27 08:43:59.654	2025-11-29 02:52:12.688	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
232323	septi	$2b$10$vNB6RFvNths.kmG97tDG..NL.VbAVqfwxm.9NeTFLq6ZlfjUsEhz.	2023	Board	Spinbath	\N	Belum diisi	\N	kajaaj		f		t	2025-11-12 04:41:22.234	2025-12-01 02:42:49.062	\N	\N	uploads/laporan_kp/septi.pdf	uploads/laporan_ta/septi.pdf	dasda	asdas	100	100	100	10	100	100
2323232	thondi	$2b$10$mgsB6bWzr2sJAXPDaseT.esfj2a0/QwMCGI89tgz1bciyaHrJeVLW	2022	APR	it	\N	non-scholar	500	\N	\N	t	-	t	2026-01-09 02:19:38.409	2026-01-09 02:21:27.09	\N	\N	uploads/laporan_kp/thondi.pdf	\N	\N	\N	\N	\N	\N	\N	\N	\N
565656	haha	$2b$10$PazeSjMe/TCud06KBb/VqebNROcf5fabzW7X40YUeJibqPva9hBY.	2003	\N	\N	\N	\N	\N	\N	\N	f	\N	t	2026-01-19 15:35:29.114	2026-01-19 15:37:06.334	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
232322	hajii	$2b$10$8Siw6s3x/H3RE0Q7d3XZlunXQr1/bHNTQ0MqjxxrRUwaDKY.KH/Fu	2023	APR	Dryer	\N	Scholars	\N			f	-	t	2025-11-18 06:55:31.527	2025-11-18 07:38:05.165	\N	\N	uploads/laporan_kp/232322.pdf	uploads/laporan_ta/232322.pdf	\N	\N	\N	\N	\N	\N	\N	\N
22553011967	Muhammad Raditya Habibie	$2b$10$RuKOM78ujewjIbYiy4gJQucq8FkTzkisDDOf2BDKZ5.xBe9lU68Gy	2022	APR	it	\N	scholar	450	\N	\N	f	-	t	2026-02-13 01:13:00.751	2026-02-13 01:13:44.216	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
85858	will	$2b$10$QaWTGQU2cr0vGC.MOM2ZZuzJahoKyhzw3yoqQGzgULhHWTlysosx6	2009	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	2026-01-19 16:20:35.359	2026-01-19 16:20:35.359	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
563	wiwiw	$2b$10$qNSBcnGerZGueqbykA92Wehle6c7AVtiqT/xOi366Z8sjrBWKLkIe	2022	APR	it	\N	Scholars	\N	\N	\N	t	\N	t	2026-01-27 14:47:12.801	2026-01-27 14:59:08.495	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
262626	Heikel Qushoyi	$2b$10$DR1.dS.myGgsbSvAmDHZne/1jt/fUNV5OaKfOF3ex2/xY9Orrxcbi	2022	RPE	Pulp	\N	scholar	800	\N	\N	t	-	t	2026-02-12 11:03:01.576	2026-02-12 11:03:40.519	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- TOC entry 5042 (class 0 OID 17094)
-- Dependencies: 224
-- Data for Name: Tugas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tugas" (id, "taskNumber", "judulTugas", "fileLaporan", "filePresentasi", "createdAt", "updatedAt", nim_mahasiswa, nilai) FROM stdin;
1	I	laporan 1	uploads/tugas_laporan/232323-Tugas-I-fileLaporan.pdf	\N	2025-11-20 04:02:36.371	2025-11-21 07:01:25.022	232323	90
2	I	laporan 1	uploads/tugas_laporan/22871622-Tugas-I-fileLaporan.pdf	\N	2025-11-21 07:03:00.467	2025-11-21 07:05:50.675	22871622	90
3	II	laporan 2	uploads/tugas_laporan/22871622-Tugas-II-fileLaporan.pdf	\N	2025-11-21 07:13:51.667	2025-11-21 07:14:11.35	22871622	90
4	III	laporan 3	uploads/tugas_laporan/22871622-Tugas-III-fileLaporan.pdf	\N	2025-11-21 07:18:43.443	2025-11-21 07:18:58.534	22871622	80
5	I	laporan 1	uploads/tugas_laporan/5504211046-Tugas-I-fileLaporan.pdf	\N	2025-11-29 02:55:42.185	2025-11-29 02:56:00.688	5504211046	100
6	II	laporan 2	uploads/tugas_laporan/232323-Tugas-II-fileLaporan.pdf	\N	2025-12-01 04:41:56.227	2025-12-01 04:42:23.102	232323	90
8	I	laporan I	uploads/tugas_laporan/22553011967-Tugas-I-fileLaporan.pdf	\N	2026-02-13 01:14:37.108	2026-02-13 01:14:37.109	22553011967	\N
7	IV	laporan IV	uploads/tugas_laporan/22871622-Tugas-IV-fileLaporan.pdf	\N	2026-02-12 11:19:56.968	2026-02-13 01:16:08.204	22871622	80
\.


--
-- TOC entry 5037 (class 0 OID 16657)
-- Dependencies: 219
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
c480b276-c54b-4a3c-a4ce-4b1a09b32556	8305cd4836ac4a273db55c8574393f43a441efcdcf0ec6d37f684f805171e2f3	2025-10-22 08:50:14.690052+07	20251015071731_add_mahasiswa_profile	\N	\N	2025-10-22 08:50:14.667057+07	1
40f93fef-b964-4772-8caa-4fbf28c04a83	b20b50b71ff4859fee2406dcd37c4110f4e3b825bbd820e1e45a184c14074e80	2025-10-22 08:50:16.435396+07	20251022015016_fix_column_lengths	\N	\N	2025-10-22 08:50:16.401826+07	1
\.


--
-- TOC entry 5039 (class 0 OID 16672)
-- Dependencies: 221
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (id, nama_lengkap, username, password_hash, created_at) FROM stdin;
\.


--
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 223
-- Name: Tugas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Tugas_id_seq"', 8, true);


--
-- TOC entry 5053 (class 0 OID 0)
-- Dependencies: 220
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_id_seq', 1, false);


--
-- TOC entry 4885 (class 2606 OID 16701)
-- Name: Mahasiswa Mahasiswa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mahasiswa"
    ADD CONSTRAINT "Mahasiswa_pkey" PRIMARY KEY (nim);


--
-- TOC entry 4888 (class 2606 OID 17109)
-- Name: Tugas Tugas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tugas"
    ADD CONSTRAINT "Tugas_pkey" PRIMARY KEY (id);


--
-- TOC entry 4879 (class 2606 OID 16670)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4881 (class 2606 OID 16685)
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- TOC entry 4883 (class 1259 OID 16703)
-- Name: Mahasiswa_nim_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Mahasiswa_nim_key" ON public."Mahasiswa" USING btree (nim);


--
-- TOC entry 4886 (class 1259 OID 17110)
-- Name: Tugas_nim_mahasiswa_taskNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Tugas_nim_mahasiswa_taskNumber_key" ON public."Tugas" USING btree (nim_mahasiswa, "taskNumber");


--
-- TOC entry 4882 (class 1259 OID 16702)
-- Name: admins_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX admins_username_key ON public.admins USING btree (username);


--
-- TOC entry 4889 (class 2606 OID 17111)
-- Name: Tugas Tugas_nim_mahasiswa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tugas"
    ADD CONSTRAINT "Tugas_nim_mahasiswa_fkey" FOREIGN KEY (nim_mahasiswa) REFERENCES public."Mahasiswa"(nim) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5049 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2026-06-13 00:55:45

--
-- PostgreSQL database dump complete
--

\unrestrict oMUmMpiyW7fHiWb2z7fTumZexRuNe2rYxOy2h8R5RpwFUXCqZTENDOidLQf8Lq4

