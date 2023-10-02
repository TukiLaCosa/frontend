import '@testing-library/jest-dom';
import axios from 'axios';
import { render, screen } from '@testing-library/react';
import React, { useState as useStateMock } from 'react';

import { check, checkUserName, createUser } from "@/app/create-user/page";
import CreateUser from '@/app/create-user/page.jsx';

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn()
}));

jest.mock('axios');

describe('Tests for creating users', () => {

    describe('Tests for check', () => {

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
                useStateMock.mockImplementation((init) => [init, setState]);
            });

            test('At start', () => {
                render(<CreateUser />);
                expect(screen.getByPlaceholderText('Nombre')).toHaveClass('is-tuki');
            });

            test('At wrong user name input', () => {
                useStateMock.mockImplementationOnce(() => ['is-danger', setClassNameMock]);
                render(<CreateUser />);
                checkUserName('', setIsCorrectMock, setClassNameMock);
                expect(screen.getByPlaceholderText('Nombre')).toHaveClass('is-danger');
            });

            test('At right user name input', () => {
                useStateMock.mockImplementationOnce(() => ['is-tuki', setClassNameMock]);
                render(<CreateUser />);
                checkUserName('abcd', setIsCorrectMock, setClassNameMock);
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
            const localStorageMock = {
                getItem: jest.fn(),
                setItem: jest.fn(),
                removeItem: jest.fn(),
                clear: jest.fn(),
            };

            beforeAll(() => {
                Object.defineProperty(window, 'localStorage', {
                    value: localStorageMock,
                    writable: true,
                });
            });

            test('With is NOT correct', () => {
                setClassNameMock.mockReset();
                createUser(false, setClassNameMock);
                expect(setClassNameMock).not.toBeCalled();
            });

            test('With IS correct & success response', async () => {
                const responseData = { id: '1', name: 'user', status: '201' };
                axios.post.mockResolvedValue(responseData);
                await createUser(true, setClassNameMock);
                expect(setClassNameMock).toBeCalledWith('is-success');
            });

            test('With IS correct & bad response', async () => {
                const responseData = { id: '1', name: 'user', status: '404' };
                axios.post.mockResolvedValue(responseData);
                await createUser(true, setClassNameMock);
                setClassNameMock.mockReset();
                expect(setClassNameMock).not.toBeCalled();
            });
        });

        describe('Set disabled', () => {

            test('At start', () => {
                render(<CreateUser />);
                expect(screen.getByRole('button', { name: /Crear Partida/i })).toBeDisabled();
                expect(screen.getByRole('button', { name: /Buscar Partida/i })).toBeDisabled();
            });

            test('At wrong user name', async () => {
                render(<CreateUser />);
                const responseData = { id: '1', name: 'user', status: '201' };
                axios.post.mockResolvedValue(responseData);
                await createUser(false, setClassNameMock);
                expect(screen.getByRole('button', { name: /Crear Partida/i })).toBeDisabled();
                expect(screen.getByRole('button', { name: /Buscar Partida/i })).toBeDisabled();
            });

            test('At wrong response', async () => {
                render(<CreateUser />);
                const responseData = { id: '1', name: 'user', status: '404' };
                axios.post.mockResolvedValue(responseData);
                await createUser(true, setClassNameMock);
                expect(screen.getByRole('button', { name: /Crear Partida/i })).toBeDisabled();
                expect(screen.getByRole('button', { name: /Buscar Partida/i })).toBeDisabled();
            });

            test('At right response', async () => {
                render(<CreateUser />);
                const responseData = { id: '1', name: 'user', status: '201' };
                axios.post.mockResolvedValue(responseData);
                await createUser(true, setClassNameMock);
                expect(screen.getByRole('button', { name: /Crear Partida/i })).not.toBeDisabled();
                expect(screen.getByRole('button', { name: /Buscar Partida/i })).not.toBeDisabled();
            });
        });
    });
});
