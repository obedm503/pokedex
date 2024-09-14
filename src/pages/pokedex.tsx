import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { useQuery } from '@apollo/client';
import { POKEMON_LIST, DETAILS } from '../operations.gql';

const TOTAL_POKEMON = 151;
const PAGE_SIZE = 10;

function List({
  page,
  id,
  setId,
}: {
  page: number;
  id?: string;
  setId: (id: string) => void;
}) {
  const res = useQuery(POKEMON_LIST);
  const list = React.useMemo(() => {
    if (!res.data?.pokemons) {
      return [];
    }

    // since the API does not do paging, do virtual paging
    return res.data.pokemons?.slice(
      page * PAGE_SIZE,
      page * PAGE_SIZE + PAGE_SIZE,
    );
  }, [res, page]);

  React.useEffect(() => {
    if (!id && res.data?.pokemons && res.data.pokemons[0]) {
      setId(res.data.pokemons[0].id);
    }
  }, [id, res, setId]);

  if (res.error) {
    return null;
  }
  if (res.loading || !res.data) {
    return null;
  }

  return (
    <div className="space-y-[15px]">
      {list.map((p) => (
        <button
          key={p?.id}
          onClick={() => p && setId(p.id)}
          className="h-[75px] w-full pl-[27px] pt-[15px] pb-[16px] flex items-center rounded-[6px] bg-[#3F414B] hover:brightness-125"
        >
          <img
            className="rounded-full h-[44px] w-[44px] bg-white mr-[26px]"
            src={p?.image || 'https://via.placeholder.com/44'}
            alt={p?.name || ''}
          />
          <div className="font-[18px] font-bold text-[#F2C94C] mr-[10px]">
            {p?.number}
          </div>
          <div className="font-[18px] font-semibold text-[#EDEDED]">
            {p?.name}
          </div>
        </button>
      ))}
    </div>
  );
}

function Pager({
  page,
  setPage,
}: {
  page: number;
  setPage: (page: number) => void;
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between ml-[21px] my-[22px] mr-[19px]">
      <div className="space-x-[12px]">
        {page > 1 ? (
          <button
            onClick={() => setPage(page - 2)}
            className="hover:brightness-150 rounded-[8px] bg-[#2D2F36] w-[32px] h-[31px]"
          >
            {page - 1}
          </button>
        ) : null}
        {page >= 1 ? (
          <button
            onClick={() => setPage(page - 1)}
            className="hover:brightness-150 rounded-[8px] bg-[#2D2F36] w-[32px] h-[31px]"
          >
            {page}
          </button>
        ) : null}
        <button className="ring-1 ring-[#F2C94C] hover:brightness-150 rounded-[8px] bg-[#2D2F36] w-[32px] h-[31px]">
          {page + 1}
        </button>
        {page + 1 < TOTAL_POKEMON / PAGE_SIZE ? (
          <button
            onClick={() => setPage(page + 1)}
            className="hover:brightness-150 rounded-[8px] bg-[#2D2F36] w-[32px] h-[31px]"
          >
            {page + 2}
          </button>
        ) : null}
        {page + 2 < TOTAL_POKEMON / PAGE_SIZE ? (
          <button
            onClick={() => setPage(page + 2)}
            className="hover:brightness-150 rounded-[8px] bg-[#2D2F36] w-[32px] h-[31px]"
          >
            {page + 3}
          </button>
        ) : null}
      </div>
      <div className="space-x-[9px] mt-2 md:mt-0">
        <button
          disabled={page <= 0}
          onClick={() => setPage(page - 1)}
          className={`${
            page <= 0
              ? 'brightness-90 cursor-not-allowed'
              : 'hover:brightness-150'
          } rounded-[8px] bg-[#2D2F36] w-[81px] h-[31px]`}
        >
          Prev
        </button>
        <button
          disabled={page + 1 >= TOTAL_POKEMON / PAGE_SIZE}
          onClick={() => setPage(page + 1)}
          className={`${
            page + 1 >= TOTAL_POKEMON / PAGE_SIZE
              ? 'brightness-90 cursor-not-allowed'
              : 'hover:brightness-150'
          } rounded-[8px] bg-[#2D2F36] w-[81px] h-[31px]`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function Details({ id }: { id?: string }) {
  const res = useQuery(DETAILS, {
    variables: id ? { id } : undefined,
    skip: !id,
  });
  if (res.error) {
    return null;
  }
  if (res.loading || !res.data?.pokemon) {
    return null;
  }
  const p = res.data.pokemon;
  return (
    <div className="flex flex-col w-full text-[#EDEDED]">
      <div className="w-full border-b-[#2D2F36] border-b-[2px] flex justify-between p-[42px]">
        <div className="text-[32px] font-semibold">{p.name}</div>
        <div
          className="text-[#F2C94C] text-[32px] font-semibold"
          style={{ letterSpacing: '0.1em' }}
        >
          #{p.number}
        </div>
      </div>
      <div className="h-full p-8 overflow-y-auto">
        <img
          src={p.image || 'https://via.placeholder.com/200'}
          alt={p.name || ''}
          className="mx-auto h-[200px] rounded-xl"
        />
        <div className="flex justify-between w-full my-6 text-center">
          <div className="flex flex-col">
            <div className="text-2xl font-semibold">
              {p.types?.filter((t) => t).join(' / ')}
            </div>
            <div>Type</div>
          </div>
          <div className="w-[2px] bg-[#2D2F36]" />
          <div className="">
            <div className="text-2xl font-semibold">
              {p.weight?.minimum} - {p.weight?.maximum}
            </div>
            <div>Weight</div>
          </div>
          <div className="w-[2px] bg-[#2D2F36]" />
          <div className="">
            <div className="text-2xl font-semibold">
              {p.height?.minimum} - {p.height?.maximum}
            </div>
            <div>Height</div>
          </div>
        </div>

        <div className="bg-[#2D2F36] h-[2px]" />

        <div className="flex">
          <div className="w-1/2 space-y-2 m-4">
            <p className="text-2xl text-center mb-4">Special Attacks</p>
            {p.attacks?.special
              ?.filter((a) => a)
              .map((a, i) => (
                <div key={i} className="rounded-[6px] bg-[#1F1F1F] p-4">
                  <div className="font-semibold flex flex-wrap text-lg">
                    {a?.name}
                    <span className="inline-block ml-auto text-[#F2C94C]">
                      {a?.damage}
                    </span>
                  </div>
                  <div>Type {a?.type}</div>
                </div>
              ))}
          </div>
          <div className="w-1/2 space-y-2 m-4">
            <p className="text-2xl text-center mb-4">Fast Attacks</p>
            {p.attacks?.fast
              ?.filter((a) => a)
              .map((a, i) => (
                <div key={i} className="rounded-[6px] bg-[#1F1F1F] p-4">
                  <div className="font-semibold flex flex-wrap text-lg">
                    {a?.name}
                    <span className="inline-block ml-auto text-[#F2C94C]">
                      {a?.damage}
                    </span>
                  </div>
                  <div>Type {a?.type}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Pokedex() {
  const [hasAuth] = useAuth();
  const [page, setPage] = React.useState(0);
  const [id, setId] = React.useState<string | undefined>(undefined);
  if (!hasAuth) return <Navigate to="/login" />;

  return (
    <div className="flex w-screen min-h-screen bg-[#484D57] p-4">
      <div
        className="bg-[#3B3E46] mx-auto my-auto rounded-[8px] flex flex-col md:flex-row overflow-y-auto md:overflow-hidden md:h-[737px]"
        style={{ width: '1198px' }}
      >
        <div className="md:min-w-[508px] bg-[#2D2F36] relative">
          <div className="p-4 md:pl-[52px] md:py-[64px] md:pr-[76px] overflow-y-auto md:h-[662px]">
            <List page={page} id={id} setId={setId} />
          </div>
          <div className="w-full md:h-[75px] p-1 md:p-0 md:absolute bottom-0 left-0 bg-[#1F1F1F] text-[#EEECEC] font-semibold text-center">
            <Pager page={page} setPage={setPage} />
          </div>
        </div>

        <Details id={id} />
      </div>
    </div>
  );
}
