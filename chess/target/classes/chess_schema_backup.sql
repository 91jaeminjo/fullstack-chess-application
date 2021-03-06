PGDMP                 	    
    x            chess    13.0    13.0     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    17513    chess    DATABASE     R   CREATE DATABASE "chess" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';
    DROP DATABASE "chess";
                postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA "public";
    DROP SCHEMA "public";
                postgres    false            �           0    0    SCHEMA "public"    COMMENT     8   COMMENT ON SCHEMA "public" IS 'standard public schema';
                   postgres    false    3            �            1259    17517    Boards    TABLE     �   CREATE TABLE "public"."Boards" (
    "boardId" integer NOT NULL,
    "prevBoardId" integer,
    "nextBoardId" integer,
    "state" character(191) NOT NULL,
    "gameId" integer
);
    DROP TABLE "public"."Boards";
       public         heap    postgres    false    3            �            1259    17515    Boards_boardId_seq    SEQUENCE     �   CREATE SEQUENCE "public"."Boards_boardId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE "public"."Boards_boardId_seq";
       public          postgres    false    201    3            �           0    0    Boards_boardId_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE "public"."Boards_boardId_seq" OWNED BY "public"."Boards"."boardId";
          public          postgres    false    200            �            1259    17525    Games    TABLE     a   CREATE TABLE "public"."Games" (
    "gameId" integer NOT NULL,
    "boardId" integer NOT NULL
);
    DROP TABLE "public"."Games";
       public         heap    postgres    false    3            �            1259    17523    Games_gameId_seq    SEQUENCE     �   CREATE SEQUENCE "public"."Games_gameId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE "public"."Games_gameId_seq";
       public          postgres    false    3    203            �           0    0    Games_gameId_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE "public"."Games_gameId_seq" OWNED BY "public"."Games"."gameId";
          public          postgres    false    202            �            1259    18618    MoveHistory    TABLE     �   CREATE TABLE "public"."MoveHistory" (
    "gameId" integer NOT NULL,
    "moveCount" integer NOT NULL,
    "move" character(10) NOT NULL
);
 #   DROP TABLE "public"."MoveHistory";
       public         heap    postgres    false    3            7           2604    17520    Boards boardId    DEFAULT     ~   ALTER TABLE ONLY "public"."Boards" ALTER COLUMN "boardId" SET DEFAULT "nextval"('"public"."Boards_boardId_seq"'::"regclass");
 C   ALTER TABLE "public"."Boards" ALTER COLUMN "boardId" DROP DEFAULT;
       public          postgres    false    201    200    201            8           2604    17528    Games gameId    DEFAULT     z   ALTER TABLE ONLY "public"."Games" ALTER COLUMN "gameId" SET DEFAULT "nextval"('"public"."Games_gameId_seq"'::"regclass");
 A   ALTER TABLE "public"."Games" ALTER COLUMN "gameId" DROP DEFAULT;
       public          postgres    false    202    203    203            :           2606    17522    Boards Boards_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY "public"."Boards"
    ADD CONSTRAINT "Boards_pkey" PRIMARY KEY ("boardId");
 B   ALTER TABLE ONLY "public"."Boards" DROP CONSTRAINT "Boards_pkey";
       public            postgres    false    201            <           2606    17530    Games Games_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY "public"."Games"
    ADD CONSTRAINT "Games_pkey" PRIMARY KEY ("gameId");
 @   ALTER TABLE ONLY "public"."Games" DROP CONSTRAINT "Games_pkey";
       public            postgres    false    203            >           2606    18622    MoveHistory MoveHistory_pkey 
   CONSTRAINT     s   ALTER TABLE ONLY "public"."MoveHistory"
    ADD CONSTRAINT "MoveHistory_pkey" PRIMARY KEY ("gameId", "moveCount");
 L   ALTER TABLE ONLY "public"."MoveHistory" DROP CONSTRAINT "MoveHistory_pkey";
       public            postgres    false    204    204            ?           2606    17806    Boards Boards_gameId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY "public"."Boards"
    ADD CONSTRAINT "Boards_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Games"("gameId") NOT VALID;
 I   ALTER TABLE ONLY "public"."Boards" DROP CONSTRAINT "Boards_gameId_fkey";
       public          postgres    false    201    3132    203            @           2606    17531    Games Games_boardId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY "public"."Games"
    ADD CONSTRAINT "Games_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "public"."Boards"("boardId");
 H   ALTER TABLE ONLY "public"."Games" DROP CONSTRAINT "Games_boardId_fkey";
       public          postgres    false    201    203    3130            A           2606    18623 #   MoveHistory MoveHistory_gameId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY "public"."MoveHistory"
    ADD CONSTRAINT "MoveHistory_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Games"("gameId");
 S   ALTER TABLE ONLY "public"."MoveHistory" DROP CONSTRAINT "MoveHistory_gameId_fkey";
       public          postgres    false    204    203    3132           