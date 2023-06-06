import { debounce } from '@tldraw/utils';
import React, { ReactElement, createContext, useCallback, useContext } from 'react';

export interface DocumentSheetOptions {
    baseApplication: any
    width: number
    height: number
    top: any
    left: any
    scale: any
    popOut: boolean
    minimizable: boolean
    resizable: boolean
    id: string
    classes: string[]
    dragDrop: any[]
    tabs: any[]
    filters: any[]
    title: string
    template: string
    scrollY: any[]
    closeOnSubmit: boolean
    editable: boolean
    sheetConfig: boolean
    submitOnChange: boolean
    submitOnClose: boolean
    viewPermission: number
    secrets: any[]
    viewClasses: any[]
    includeTOC: boolean
}

type DocumentSheet = {
    cssClass: string
    editable: boolean
    document: any
    data: any
    limited: boolean
    options: DocumentSheetOptions
    owner: boolean
    title: string
    headingLevels: {
        [key: string]: string
    }
    id: string
}

export type DocumentSheetState = {
    sheet: DocumentSheet
    update: (data?: any, context?: any) => Promise<any>
}

const defaultDocumentSheetState = {
    sheet: {
        cssClass: '',
        editable: false,
        document: null,
        data: null,
        limited: false,
        options: {
            baseApplication: null,
            width: 0,
            height: 0,
            top: 0,
            left: 0,
            scale: 0,
            popOut: false,
            minimizable: false,
            resizable: false,
            id: '',
            classes: [],
            dragDrop: [],
            tabs: [],
            filters: [],
            title: '',
            template: '',
            scrollY: [],
            closeOnSubmit: false,
            editable: false,
            sheetConfig: false,
            submitOnChange: false,
            submitOnClose: false,
            viewPermission: 0,
            secrets: [],
            viewClasses: [],
            includeTOC: false
        },
        owner: false,
        title: '',
        headingLevels: {},
        id: ''
    },
    update: async () => {}
}

const DocumentSheetContext = createContext<DocumentSheetState>(defaultDocumentSheetState)

export const useDocumentSheet = () => useContext(DocumentSheetContext)

const DEBOUNCE_TIME = 1000

export const DocumentSheetProvider = ({sheet, children}): ReactElement => {
    const update = useCallback(debounce(async (data?: any, context?: any) => {
        return await sheet.document.update(data, context)
    }, DEBOUNCE_TIME), [sheet?.document])
    return <DocumentSheetContext.Provider value={{sheet, update}}>
        {children}
    </DocumentSheetContext.Provider>
};
