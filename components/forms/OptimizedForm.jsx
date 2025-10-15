import { memo, useCallback, useMemo } from 'react';
import { Formik, Form } from 'formik';
import { usePerformanceMonitor } from '@/hooks/usePerformance';

const OptimizedForm = memo(function OptimizedForm({
    initialValues,
    validationSchema,
    onSubmit,
    children,
    enableReinitialize = false,
    validateOnChange = false,
    validateOnBlur = true,
    ...props
}) {
    const { measureFunction } = usePerformanceMonitor('OptimizedForm');

    const memoizedInitialValues = useMemo(() => initialValues, [initialValues]);
    
    const handleSubmit = useCallback((values, formikBag) => {
        measureFunction('submit', () => {
            onSubmit(values, formikBag);
        });
    }, [onSubmit, measureFunction]);

    const memoizedValidationSchema = useMemo(() => validationSchema, [validationSchema]);

    return (
        <Formik
            initialValues={memoizedInitialValues}
            validationSchema={memoizedValidationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={enableReinitialize}
            validateOnChange={validateOnChange}
            validateOnBlur={validateOnBlur}
            {...props}
        >
            {(formikProps) => (
                <Form className="om-form">
                    {typeof children === 'function' ? children(formikProps) : children}
                </Form>
            )}
        </Formik>
    );
});

export default OptimizedForm;