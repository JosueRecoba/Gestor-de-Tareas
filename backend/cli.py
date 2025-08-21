#!/usr/bin/env python3

import argparse

def build_parser():
    parser = argparse.ArgumentParser(
        description="Gestor de Tareas - CLI (scaffold)"
    )
    parser.add_argument("--version", action="store_true", help="Mostrar versión")
    return parser

def main():
    parser = build_parser()
    args = parser.parse_args()
    if args.version:
        print("Gestor de Tareas CLI - scaffold 0.1.0")
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
