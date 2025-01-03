import styles from '@/components/inputs/FileUploaderSave.module.css';

import { Fragment, useState } from 'react';
import { useFormikContext } from 'formik';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import ClearIcon from '@mui/icons-material/Clear';
import FileCopyIcon from '@mui/icons-material/FileCopy';

const FileUploader = ({ title, name, number, stain }) => {
    const [files, setFiles] = useState([]);

    const { setFieldValue } = useFormikContext();

    const { getRootProps, getInputProps, fileRejections } = useDropzone({
        onDrop: (acceptedFiles) => {
            if (stain) {
                const newFiles = acceptedFiles.map((file) =>
                    Object.assign(file)
                );
                setFiles(acceptedFiles.map((file) => Object.assign(file)));
                setFieldValue(name, newFiles[0]);
            } else {
                setFiles(acceptedFiles.map((file) => Object.assign(file)));
                setFieldValue(
                    name,
                    acceptedFiles.map((file) => Object.assign(file))
                );
            }
        },
        maxFiles: number,
    });

    const fileRejectionItems = fileRejections.map(({ file, errors }) => {
        return (
            <li
                key={file.path}
                style={{ marginBottom: '10px', color: 'red', fontSize: '12px' }}
            >
                File Name: {file.path}({file.size} bytes)
                <ul>
                    {errors.map((e) => (
                        <li key={e.code}>{e.message}</li>
                    ))}
                </ul>
            </li>
        );
    });

    const renderFilePreview = (file) => {
        if (file.type.startsWith('image')) {
            return (
                <Image
                    width={38}
                    height={38}
                    alt={file.name}
                    src={URL.createObjectURL(file)}
                />
            );
        } else {
            return <FileCopyIcon />;
        }
    };

    const handleRemoveFile = (file) => {
        const uploadedFiles = files;
        const filtered = uploadedFiles.filter((i) => i.name !== file.name);
        setFiles([...filtered]);
    };

    const fileList = files.map((file) => (
        <ListItem
            key={file.name}
            sx={{
                border: '1px solid #eee',
                justifyContent: 'space-between',
                mt: '10px',
                mb: '10px',
            }}
            className="dark-border"
        >
            <div className={styles.fileDetails}>
                <div className={styles.filePreview}>
                    {renderFilePreview(file)}
                </div>
                <div>
                    <Typography className={styles.fileName}>
                        {file.name}
                    </Typography>
                </div>
            </div>
            <IconButton onClick={() => handleRemoveFile(file)}>
                <ClearIcon />
            </IconButton>
        </ListItem>
    ));

    const handleLinkClick = (event) => {
        event.preventDefault();
    };

    const handleRemoveAllFiles = () => {
        setFiles([]);
    };

    return (
        <Card
            sx={{
                backgroundColor: '#F5F5F5',
                boxShadow: 'none',
                borderRadius: '10px',
                width: '100%',
            }}
        >
            <Typography
                as="h3"
                sx={{
                    fontSize: 18,
                    fontWeight: 500,
                    mb: '5px',
                }}
            >
                {title}
            </Typography>

            <div {...getRootProps()} className={styles.dropzone}>
                <input {...getInputProps()} />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: ['column', 'column', 'row'],
                        alignItems: 'center',
                    }}
                >
                    <Image
                        width={80}
                        height={80}
                        alt="Upload img"
                        src="/assets/images/misc/upload.webp"
                        className={styles.thumbImage}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            textAlign: ['center', 'center', 'inherit'],
                        }}
                    >
                        <Typography color="textSecondary">
                            برای بارگذاری تصویر کلیک کنید{' '}
                            <Link href="/pages" onClick={handleLinkClick}>
                                جستجو
                            </Link>{' '}
                        </Typography>
                        {number !== 1 && (
                            <Typography color="textSecondary">
                                برای انتخاب چند عکس دکمه Ctrl را نگه دارید
                            </Typography>
                        )}
                    </Box>
                </Box>
            </div>

            {files.length ? (
                <Fragment>
                    <List>{fileList}</List>
                    <div className={styles.buttons}>
                        <Button
                            color="error"
                            variant="contained"
                            onClick={handleRemoveAllFiles}
                            sx={{
                                textTransform: 'capitalize',
                                color: '#fff !important',
                            }}
                        >
                            حذف همه
                        </Button>
                    </div>
                </Fragment>
            ) : null}
            {fileRejectionItems.length !== 0 && (
                <>
                    <Typography
                        as="h5"
                        sx={{
                            fontSize: 14,
                            color: 'red',
                            marginTop: '15px',
                            marginBottom: '15px',
                        }}
                    >
                        خطا
                    </Typography>
                    <ul style={{ margin: '0', padding: '0' }}>
                        {fileRejectionItems}
                    </ul>
                </>
            )}
        </Card>
    );
};

export default FileUploader;
