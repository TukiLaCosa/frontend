import '@testing-library/jest-dom';
import axios from 'axios';
import { render, screen } from '@testing-library/react';
import React, { useState as useStateMock } from 'react';

import { check, checkUserName, createUser } from "@/app/create-user/page";
import CreateUser from '@/app/create-user/page.jsx';

// Mock state.
jest.mock('react', () => ({
    // Returns the actual module instead of a mock,
    // bypassing all checks on whether the module should receive 
    // a mock implementation or not.
    ...jest.requireActual('react'),
    useState: jest.fn()
}));

jest.mock('axios');

describe('Tests for creating users', () => {

    describe('Test for check', () => {

        test('Correct name', () => {
            expect(check('abc123')).toBeTruthy();
        });

        test('Void String', () => {
            expect(check('')).toBeFalsy();
        });

        test('Less than four characters (3)', () => {
            expect(check('abc')).toBeFalsy();
        });

        test('More than eigth characters (9)', () => {
            expect(check('abcdefghi')).toBeFalsy();
        });

        test('Only numbers', () => {
            expect(check('123456')).toBeFalsy();
        });

        test('Start with a number', () => {
            expect(check('1abc')).toBeFalsy();
        });

        describe('Special characters', () => {

            test('/', () => {
                expect(check('/abc123')).toBeFalsy();
                expect(check('abc/123')).toBeFalsy();
                expect(check('abc123/')).toBeFalsy();
            });

            test('+', () => {
                expect(check('+abc123')).toBeFalsy();
                expect(check('abc+123')).toBeFalsy();
                expect(check('abc123+')).toBeFalsy();
            });

            test('-', () => {
                expect(check('-abc123')).toBeFalsy();
                expect(check('abc-123')).toBeFalsy();
                expect(check('abc123-')).toBeFalsy();
            });

            test('*', () => {
                expect(check('*abc123')).toBeFalsy();
                expect(check('abc*123')).toBeFalsy();
                expect(check('abc123*')).toBeFalsy();
            });

            test('%', () => {
                expect(check('%abc123')).toBeFalsy();
                expect(check('abc%123')).toBeFalsy();
                expect(check('abc123%')).toBeFalsy();
            });

            test('@', () => {
                expect(check('@abc123')).toBeFalsy();
                expect(check('abc@123')).toBeFalsy();
                expect(check('abc123@')).toBeFalsy();
            });
        });
    });

    const setClassNameMock = jest.fn();
    const setIsCorrectMock = jest.fn();
    const setState = jest.fn();

    describe('Tests for checkUserName', () => {

        describe('Call setIsCorrect', () => {

            test('With right user name', () => {
                checkUserName('abcd', setIsCorrectMock, setClassNameMock);
                expect(setIsCorrectMock).toBeCalledWith(true);
            });

            test('With worng user name', () => {
                checkUserName('', setIsCorrectMock, setClassNameMock);
                expect(setIsCorrectMock).toBeCalledWith(false);
            });
        });

        describe('Call setClassName', () => {

            test('Whit right user name', () => {
                checkUserName('abcd', setIsCorrectMock, setClassNameMock);
                expect(setClassNameMock).toBeCalledWith('is-tuki');
            });

            test('Whit wrong user name', () => {
                checkUserName('abcd', setIsCorrectMock, setClassNameMock);
                expect(setClassNameMock).toBeCalledWith('is-danger');
            });
        });

        describe('Right className', () => {

            beforeEach(() => {
                // @ts-ignore
                // Accepts a function that will be used as an implementation of the mock for one call to the mocked function. 
                // Can be chained so that multiple function calls produce different results.
                useStateMock.mockImplementation((init) => [init, setState]);
            });

            test('At start', () => {
                render(<CreateUser />);
                expect(screen.getByPlaceholderText('Nombre')).toHaveClass('is-tuki');
            });

            test('At wrong user name input', () => {
                useStateMock.mockImplementationOnce(() => ['is-danger', setClassNameMock]);
                checkUserName('', setIsCorrectMock, setClassNameMock);
                render(<CreateUser />);
                expect(screen.getByPlaceholderText('Nombre')).toHaveClass('is-danger');
            });

            test('At right user name input', () => {
                useStateMock.mockImplementationOnce(() => ['is-tuki', setClassNameMock]);
                checkUserName('abcd', setIsCorrectMock, setClassNameMock);
                render(<CreateUser />);
                expect(screen.getByPlaceholderText('Nombre')).toHaveClass('is-tuki');
            });
        });

        /**
         * se llama a la funcion setIsCorrect bien por test anteriores
         * ¿Cómo checkeo que se seteo bien?
         * Checkeo indirecto en la proxima funcion
         */
        // describe('Right isCorrect', () => {

        // });
    });

    describe('Tests for createUser', () => {

        describe('Call setClassName correctly', () => {

            test('With is NOT correct', () => {
                setClassNameMock.mockReset();
                createUser(false, setClassNameMock);
                expect(setClassNameMock).not.toBeCalled();
            });

            test('With IS correct', async () => {
                const responseData = { id: '1', name: 'user', status: '201' };
                axios.post.mockResolvedValue(responseData);
                await createUser(true, setClassNameMock);
                expect(setClassNameMock).toBeCalledWith('is-success');
            });
        });
    });
});