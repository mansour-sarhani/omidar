import getContractByContractNo from '@/functions/contract/getContractByContractNo';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function useContract(contractNo) {
    const [contract, setContract] = useState(null);

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        async function fetchContract() {
            await getContractByContractNo(
                dispatch,
                enqueueSnackbar,
                setContract,
                contractNo
            );
        }
        fetchContract();
    }, [contractNo, dispatch, enqueueSnackbar]);

    return {
        contract,
    };
}
